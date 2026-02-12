# Grafana Integration Guide

This guide explains how to integrate this project with Grafana to track CI/CD metrics, specifically First Time Pass Rate (FTPR).

## Metrics to Track

### 1. First Time Pass Rate (FTPR)

**Definition**: Percentage of Pull Requests that are merged with CI passing on the first commit attempt.

**Why it matters**: High FTPR indicates good code quality, effective local testing, and well-configured CI pipelines.

### 2. CI Success Rate

**Definition**: Overall percentage of CI runs that pass vs. fail.

### 3. Mean Time to Green

**Definition**: Average time it takes for a PR to have a passing CI check.

## Data Sources

You can collect data from this repository using:

### Option 1: GitHub API

Use the GitHub REST API to fetch:
- Pull requests
- Commit statuses
- Check runs
- Workflow runs

**Endpoints**:
```
GET /repos/{owner}/{repo}/pulls
GET /repos/{owner}/{repo}/commits/{ref}/status
GET /repos/{owner}/{repo}/actions/runs
```

### Option 2: GitHub Webhooks

Set up webhooks to push data to your metrics system:
- `pull_request` events
- `check_run` events
- `workflow_run` events
- `status` events

### Option 3: GitHub Actions to Database

Modify the CI workflow to push results to a database:

```yaml
- name: Report CI metrics
  if: always()
  run: |
    curl -X POST https://your-metrics-endpoint.com/ci-results \
      -H "Content-Type: application/json" \
      -d '{
        "repo": "${{ github.repository }}",
        "pr": "${{ github.event.pull_request.number }}",
        "commit": "${{ github.sha }}",
        "status": "${{ job.status }}",
        "timestamp": "${{ github.event.head_commit.timestamp }}"
      }'
```

## Grafana Dashboard Setup

### Sample Queries (using Prometheus/PostgreSQL)

#### FTPR Calculation

```sql
SELECT
  COUNT(CASE WHEN first_run_passed = true THEN 1 END) * 100.0 / COUNT(*) as ftpr
FROM pull_requests
WHERE merged_at > NOW() - INTERVAL '30 days'
```

#### CI Success Rate Over Time

```sql
SELECT
  DATE_TRUNC('day', created_at) as date,
  COUNT(CASE WHEN status = 'success' THEN 1 END) * 100.0 / COUNT(*) as success_rate
FROM ci_runs
GROUP BY date
ORDER BY date
```

#### Failed vs Passed CI Runs

```sql
SELECT
  status,
  COUNT(*) as count
FROM ci_runs
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY status
```

## Panel Suggestions

### 1. FTPR Gauge
- **Visualization**: Gauge
- **Metric**: Current FTPR percentage
- **Thresholds**:
  - Red: < 70%
  - Yellow: 70-85%
  - Green: > 85%

### 2. CI Trends Graph
- **Visualization**: Time series
- **Metrics**: Daily pass/fail counts
- **Period**: Last 30 days

### 3. Top Failing Tests Table
- **Visualization**: Table
- **Columns**: Test name, Fail count, Last failure
- **Sort**: By fail count descending

### 4. PR Cycle Time
- **Visualization**: Histogram
- **Metric**: Time from PR creation to merge
- **Buckets**: 0-1h, 1-4h, 4-24h, 1-3d, 3d+

## Data Collection Script Example

Here's a Python script to collect data from GitHub API:

```python
import requests
from datetime import datetime

REPO = "owner/ftpr-poc"
TOKEN = "your-github-token"

def get_pr_metrics():
    headers = {"Authorization": f"token {TOKEN}"}

    # Get merged PRs
    prs = requests.get(
        f"https://api.github.com/repos/{REPO}/pulls",
        params={"state": "closed", "per_page": 100},
        headers=headers
    ).json()

    metrics = []

    for pr in prs:
        if not pr.get("merged_at"):
            continue

        # Get commits for this PR
        commits = requests.get(
            pr["commits_url"],
            headers=headers
        ).json()

        first_commit = commits[0]["sha"]

        # Get check runs for first commit
        checks = requests.get(
            f"https://api.github.com/repos/{REPO}/commits/{first_commit}/check-runs",
            headers=headers
        ).json()

        first_run_passed = all(
            check["conclusion"] == "success"
            for check in checks.get("check_runs", [])
        )

        metrics.append({
            "pr_number": pr["number"],
            "created_at": pr["created_at"],
            "merged_at": pr["merged_at"],
            "first_run_passed": first_run_passed,
            "commits_count": pr["commits"]
        })

    return metrics

# Calculate FTPR
metrics = get_pr_metrics()
ftpr = sum(1 for m in metrics if m["first_run_passed"]) / len(metrics) * 100
print(f"FTPR: {ftpr:.2f}%")
```

## Testing Your Dashboard

Use this project to generate test data:

1. **Generate passing PRs**:
   ```bash
   for i in {1..5}; do
     git checkout -b "test-pass-$i"
     echo "pass" > .ci-control
     git add .ci-control
     git commit -m "Test passing PR $i"
     git push origin "test-pass-$i"
     # Create and merge PR via GitHub UI or CLI
   done
   ```

2. **Generate failing then passing PRs**:
   ```bash
   for i in {1..3}; do
     git checkout -b "test-fail-$i"
     echo "fail" > .ci-control
     git add .ci-control
     git commit -m "Test failing PR $i - initial"
     git push origin "test-fail-$i"
     # Create PR

     echo "pass" > .ci-control
     git add .ci-control
     git commit -m "Fix CI"
     git push origin "test-fail-$i"
     # Merge PR
   done
   ```

## Recommended Grafana Plugins

- **GitHub datasource**: Official GitHub data source plugin
- **Postgres datasource**: If storing metrics in PostgreSQL
- **Prometheus datasource**: If using Prometheus for metrics
- **JSON API datasource**: For custom API endpoints

## Resources

- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [Grafana Documentation](https://grafana.com/docs/)
- [GitHub Actions API](https://docs.github.com/en/rest/actions)
