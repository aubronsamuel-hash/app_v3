import http from 'k6/http'
import { check, sleep } from 'k6'
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js'

export const options = {
  vus: 1,
  iterations: 1,
}

export default function () {
  const res = http.get('http://localhost:8001/healthz')
  check(res, { 'status 200': r => r.status === 200 })
  sleep(1)
}

export function handleSummary(data) {
  return {
    'perf/reports/index.html': htmlReport(data),
  }
}
