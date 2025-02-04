import React, {useEffect, useState} from 'react';
import * as storage from '../../util/storage'
import { getFiltersByKeyPrefix, isFilteringOnFixedValue } from '../../util/filters'
import ListReport from '../reports/list'
import * as api from '../../api'
import * as url from '../../util/url'
import { VISITORS_METRIC, PERCENTAGE_METRIC, maybeWithCR } from '../reports/metrics';
import ImportedQueryUnsupportedWarning from '../imported-query-unsupported-warning';

// Icons copied from https://github.com/alrra/browser-logos
const BROWSER_ICONS = {
  'Chrome': 'chrome.svg',
  'Safari': 'safari.png',
  'Firefox': 'firefox.svg',
  'Microsoft Edge': 'edge.svg',
  'Vivaldi': 'vivaldi.svg',
  'Opera': 'opera.svg',
  'Samsung Browser': 'samsung-internet.svg',
  'Chromium': 'chromium.svg',
  'UC Browser': 'uc.svg',
  'Yandex Browser': 'yandex.png', // Only PNG available in browser-logos
  // Logos underneath this line are not available in browser-logos. Grabbed from random places on the internets.
  'DuckDuckGo Privacy Browser': 'duckduckgo.svg',
  'MIUI Browser': 'miui.webp',
  'Huawei Browser Mobile': 'huawei.png',
  'QQ Browser': 'qq.png',
  'Ecosia': 'ecosia.png',
  'vivo Browser': 'vivo.png'
}

function browserIconFor(browser) {
  const filename = BROWSER_ICONS[browser] || 'fallback.svg'

  return (
    <img
      src={`/images/icon/browser/${filename}`}
      className="w-4 h-4 mr-2"
    />
  )
}

function Browsers({ query, site, afterFetchData }) {
  function fetchData() {
    return api.get(url.apiPath(site, '/browsers'), query)
  }

  function getFilterFor(listItem) {
    return {
      prefix: 'browser',
      filter: ["is", "browser", [listItem['name']]]
    }
  }

  function renderIcon(listItem) {
    return browserIconFor(listItem.name)
  }

  return (
    <ListReport
      fetchData={fetchData}
      afterFetchData={afterFetchData}
      getFilterFor={getFilterFor}
      keyLabel="Browser"
      metrics={maybeWithCR([VISITORS_METRIC, PERCENTAGE_METRIC], query)}
      query={query}
      renderIcon={renderIcon}
    />
  )
}

function BrowserVersions({ query, site, afterFetchData }) {
  function fetchData() {
    return api.get(url.apiPath(site, '/browser-versions'), query)
      .then(res => {
        return {...res, results: res.results.map((row => {
          return {...row, name: `${row.browser} ${row.name}`}
        }))}
      })
  }

  function renderIcon(listItem) {
    return browserIconFor(listItem.browser)
  }

  function getFilterFor(listItem) {
    if (getSingleFilter(query, "browser") == '(not set)') {
      return null
    }
    return {
      prefix: 'browser_version',
      filter: ["is", "browser_version", [listItem['name']]]
    }
  }

  return (
    <ListReport
      fetchData={fetchData}
      afterFetchData={afterFetchData}
      getFilterFor={getFilterFor}
      keyLabel="Browser version"
      metrics={maybeWithCR([VISITORS_METRIC, PERCENTAGE_METRIC], query)}
      renderIcon={renderIcon}
      query={query}
    />
  )

}

function OperatingSystems({ query, site, afterFetchData }) {
  function fetchData() {
    return api.get(url.apiPath(site, '/operating-systems'), query)
  }

  function getFilterFor(listItem) {
    return {
      prefix: 'os',
      filter: ["is", "os", [listItem['name']]]
    }
  }

  return (
    <ListReport
      fetchData={fetchData}
      afterFetchData={afterFetchData}
      getFilterFor={getFilterFor}
      keyLabel="Operating system"
      metrics={maybeWithCR([VISITORS_METRIC, PERCENTAGE_METRIC], query)}
      query={query}
    />
  )
}

function OperatingSystemVersions({ query, site, afterFetchData }) {
  function fetchData() {
    return api.get(url.apiPath(site, '/operating-system-versions'), query)
  }

  function getFilterFor(listItem) {
    if (getSingleFilter(query, "os") == '(not set)') {
      return null
    }
    return {
      prefix: 'os_version',
      filter: ["is", "os_version", [listItem['name']]]
    }
  }

  return (
    <ListReport
      fetchData={fetchData}
      afterFetchData={afterFetchData}
      getFilterFor={getFilterFor}
      keyLabel="Operating System Version"
      metrics={maybeWithCR([VISITORS_METRIC, PERCENTAGE_METRIC], query)}
      query={query}
    />
  )

}

function ScreenSizes({ query, site, afterFetchData }) {
  function fetchData() {
    return api.get(url.apiPath(site, '/screen-sizes'), query)
  }

  function renderIcon(screenSize) {
    return (
      <span className="mr-1.5">{iconFor(screenSize.name)}</span>
    )
  }

  function getFilterFor(listItem) {
    return {
      prefix: 'screen',
      filter: ["is", "screen", [listItem['name']]]
    }
  }

  return (
    <ListReport
      fetchData={fetchData}
      afterFetchData={afterFetchData}
      getFilterFor={getFilterFor}
      keyLabel="Screen size"
      metrics={maybeWithCR([VISITORS_METRIC, PERCENTAGE_METRIC], query)}
      query={query}
      renderIcon={renderIcon}
    />
  )
}

function iconFor(screenSize) {
  if (screenSize === 'Mobile') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="-mt-px feather"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12" y2="18" /></svg>
    )
  } else if (screenSize === 'Tablet') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="-mt-px feather"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" transform="rotate(180 12 12)" /><line x1="12" y1="18" x2="12" y2="18" /></svg>
    )
  } else if (screenSize === 'Laptop') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="-mt-px feather"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="2" y1="20" x2="22" y2="20" /></svg>
    )
  } else if (screenSize === 'Desktop') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="-mt-px feather"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
    )
  } else if (screenSize === '(not set)') {
    return null
  }
}

export default function Devices(props) {
  const {site, query} = props
  const tabKey = `deviceTab__${site.domain}`
  const storedTab = storage.getItem(tabKey)
  const [mode, setMode] = useState(storedTab || 'browser')
  const [loading, setLoading] = useState(true)
  const [skipImportedReason, setSkipImportedReason] = useState(null)

  function switchTab(mode) {
    storage.setItem(tabKey, mode)
    setMode(mode)
  }

  function afterFetchData(apiResponse) {
    setLoading(false)
    setSkipImportedReason(apiResponse.skip_imported_reason)
  }

  useEffect(() => setLoading(true), [query, mode])

  function renderContent() {
    switch (mode) {
      case 'browser':
        if (isFilteringOnFixedValue(query, 'browser')) {
          return <BrowserVersions site={site} query={query} afterFetchData={afterFetchData} />
        }
        return <Browsers site={site} query={query} afterFetchData={afterFetchData} />
      case 'os':
        if (isFilteringOnFixedValue(query, 'os')) {
          return <OperatingSystemVersions site={site} query={query} afterFetchData={afterFetchData} />
        }
        return <OperatingSystems site={site} query={query} afterFetchData={afterFetchData} />
      case 'size':
      default:
        return <ScreenSizes site={site} query={query} afterFetchData={afterFetchData} />
    }
  }

  function renderPill(name, pill) {
    const isActive = mode === pill

    if (isActive) {
      return (
        <button
          className="inline-block h-5 font-bold text-indigo-700 active-prop-heading dark:text-indigo-500"
        >
          {name}
        </button>
      )
    }

    return (
      <button
        className="cursor-pointer hover:text-indigo-600"
        onClick={() => switchTab(pill)}
      >
        {name}
      </button>
    )
  }

  return (
    <div>
      <div className="flex justify-between w-full">
        <div className="flex gap-x-1">
          <h3 className="font-bold dark:text-gray-100">Devices</h3>
          <ImportedQueryUnsupportedWarning loading={loading} query={query} skipImportedReason={skipImportedReason}/>
        </div>
        <div className="flex text-xs font-medium text-gray-500 dark:text-gray-400 space-x-2">
          {renderPill('Browser', 'browser')}
          {renderPill('OS', 'os')}
          {renderPill('Size', 'size')}
        </div>
      </div>
      {renderContent()}
    </div>
  )
}

function getSingleFilter(query, filterKey) {
  const matches = getFiltersByKeyPrefix(query, filterKey)
  if (matches.length != 1) {
    return null
  }
  const clauses = matches[0][2]

  return clauses.length == 1 ? clauses[0] : null
}
