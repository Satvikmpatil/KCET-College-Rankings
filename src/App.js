import React, { useState, useMemo } from 'react';
import { collegeData, departments } from './data';

function App() {
  const [search, setSearch] = useState('');
  const [codeSearch, setCodeSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [sortKey, setSortKey] = useState('r2');
  const [sortOrder, setSortOrder] = useState('asc');
  const [minRank, setMinRank] = useState('');
  const [maxRank, setMaxRank] = useState('');
  const [rankType, setRankType] = useState('r2');

  const filteredAndSorted = useMemo(() => {
    let data = [...collegeData];

    // Search filter (college name)
    if (search) {
      const searchLower = search.toLowerCase();
      data = data.filter(
        (item) => item.name.toLowerCase().includes(searchLower)
      );
    }

    // Code filter
    if (codeSearch) {
      const codeLower = codeSearch.toLowerCase();
      data = data.filter(
        (item) => item.code.toLowerCase().includes(codeLower)
      );
    }

    // Department filter
    if (deptFilter) {
      data = data.filter((item) => item.dept === deptFilter);
    }

    // Rank range filter
    if (minRank || maxRank) {
      data = data.filter((item) => {
        const rank = item[rankType];
        if (minRank && rank < parseInt(minRank)) return false;
        if (maxRank && rank > parseInt(maxRank)) return false;
        return true;
      });
    }

    // Sort
    data.sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return data;
  }, [search, codeSearch, deptFilter, sortKey, sortOrder, minRank, maxRank, rankType]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCodeSearch('');
    setDeptFilter('');
    setMinRank('');
    setMaxRank('');
    setSortKey('r2');
    setSortOrder('asc');
    setRankType('r2');
  };

  const getDeptClass = (dept) => {
    const map = {
      'CS': 'dept-CS',
      'CS(AI&ML)': 'dept-CS-AIML',
      'CS(CYB)': 'dept-CS-CYB',
      'CS(DS)': 'dept-CS-DS',
      'AIML': 'dept-AIML',
      'AIDS': 'dept-AIDS',
      'ISE': 'dept-ISE',
    };
    return map[dept] || '';
  };

  const getSortIcon = (key) => {
    if (sortKey !== key) return '↕';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="app">
      <h1>KCET College Rankings - GM Category</h1>

      <div className="filters">
        <div className="filter-group">
          <label>Search College Name</label>
          <input
            type="text"
            placeholder="Search college..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group" style={{ maxWidth: '150px' }}>
          <label>Search Code</label>
          <input
            type="text"
            placeholder="E005, E006..."
            value={codeSearch}
            onChange={(e) => setCodeSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Department</label>
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Filter by Rank Type</label>
          <select value={rankType} onChange={(e) => setRankType(e.target.value)}>
            <option value="r1">R-1</option>
            <option value="r2">R-2</option>
            <option value="r3">R-3</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Rank Range ({rankType.toUpperCase()})</label>
          <div className="rank-range">
            <input
              type="number"
              placeholder="Min"
              value={minRank}
              onChange={(e) => setMinRank(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max"
              value={maxRank}
              onChange={(e) => setMaxRank(e.target.value)}
            />
          </div>
        </div>

        <button className="clear-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      <div className="stats">
        <span>
          Showing <strong>{filteredAndSorted.length}</strong> of{' '}
          <strong>{collegeData.length}</strong> entries
        </span>
        <span>
          Sorted by: <strong>{sortKey.toUpperCase()}</strong> ({sortOrder === 'asc' ? 'Low to High' : 'High to Low'})
        </span>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>
                Sl.No
              </th>
              <th onClick={() => handleSort('code')} className={sortKey === 'code' ? 'sorted' : ''}>
                Code <span className="sort-icon">{getSortIcon('code')}</span>
              </th>
              <th onClick={() => handleSort('name')} className={sortKey === 'name' ? 'sorted' : ''}>
                College Name <span className="sort-icon">{getSortIcon('name')}</span>
              </th>
              <th onClick={() => handleSort('dept')} className={sortKey === 'dept' ? 'sorted' : ''}>
                Department <span className="sort-icon">{getSortIcon('dept')}</span>
              </th>
              <th onClick={() => handleSort('r1')} className={sortKey === 'r1' ? 'sorted' : ''}>
                R-1 <span className="sort-icon">{getSortIcon('r1')}</span>
              </th>
              <th onClick={() => handleSort('r2')} className={sortKey === 'r2' ? 'sorted' : ''}>
                R-2 <span className="sort-icon">{getSortIcon('r2')}</span>
              </th>
              <th onClick={() => handleSort('r3')} className={sortKey === 'r3' ? 'sorted' : ''}>
                R-3 <span className="sort-icon">{getSortIcon('r3')}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  No colleges found matching your criteria
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((item, index) => (
                <tr key={`${item.code}-${item.dept}-${index}`}>
                  <td style={{ textAlign: 'center', fontWeight: '600', color: '#666' }}>{index + 1}</td>
                  <td className="code-cell">{item.code}</td>
                  <td>{item.name}</td>
                  <td>
                    <span className={`dept-badge ${getDeptClass(item.dept)}`}>
                      {item.dept}
                    </span>
                  </td>
                  <td className="rank-cell">{item.r1.toLocaleString()}</td>
                  <td className="rank-cell">{item.r2.toLocaleString()}</td>
                  <td className="rank-cell">{item.r3.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
