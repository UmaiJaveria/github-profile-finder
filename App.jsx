import { useState } from 'react'
import {
  Search, Github, MapPin, Building2, Users, BookOpen, Star,
  ExternalLink, Code2, GitFork, Link as LinkIcon, AlertCircle,
  LoaderCircle, Sparkles
} from 'lucide-react'

const API = 'https://api.github.com'

function App() {
  const [username, setUsername] = useState('')
  const [profile, setProfile] = useState(null)
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  async function searchUser(event) {
    event?.preventDefault()
    const cleanName = username.trim()
    if (!cleanName) {
      setError('Please enter a GitHub username first.')
      setProfile(null)
      setRepos([])
      setSearched(true)
      return
    }

    setLoading(true)
    setError('')
    setProfile(null)
    setRepos([])
    setSearched(true)

    try {
      const profileResponse = await fetch(`${API}/users/${encodeURIComponent(cleanName)}`)
      if (profileResponse.status === 404) throw new Error('No GitHub user was found with that username. Check the spelling and try again.')
      if (profileResponse.status === 403 || profileResponse.status === 429) {
        throw new Error('GitHub API rate limit reached. Please wait a little and try again.')
      }
      if (!profileResponse.ok) throw new Error(`GitHub returned an error (${profileResponse.status}). Please try again.`)

      const profileData = await profileResponse.json()
      const reposResponse = await fetch(`${API}/users/${encodeURIComponent(cleanName)}/repos?sort=updated&per_page=100`)
      let reposData = []
      if (reposResponse.ok) reposData = await reposResponse.json()
      else if (reposResponse.status === 403 || reposResponse.status === 429) {
        throw new Error('GitHub API rate limit reached while loading repositories. Please wait and search again.')
      } else {
        throw new Error('The profile loaded, but repositories could not be fetched. Please try again.')
      }

      setProfile(profileData)
      setRepos(Array.isArray(reposData) ? reposData.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)) : [])
    } catch (err) {
      setError(err instanceof TypeError
        ? 'Network error. Check your internet connection and try again.'
        : (err.message || 'Something went wrong. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (number = 0) => new Intl.NumberFormat('en').format(number)

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="GitHub Finder home" onClick={() => { setProfile(null); setRepos([]); setError(''); setSearched(false); setUsername('') }}>
          <span className="brand-icon"><Github size={25} /></span>
          <span>GitHub<span className="brand-light">Finder</span></span>
        </a>
        <a className="top-link" href="https://github.com" target="_blank" rel="noreferrer">GitHub <ExternalLink size={14} /></a>
      </header>

      <main>
        <section className="hero">
          <div className="eyebrow"><Sparkles size={15} /> DEVELOPER DISCOVERY TOOL</div>
          <h1>Explore the world of<br /><span>open-source developers.</span></h1>
          <p className="hero-copy">Search any GitHub username to discover their profile, projects, and the code they share with the world.</p>
          <form className="search-form" onSubmit={searchUser}>
            <Search className="search-icon" size={21} />
            <label className="sr-only" htmlFor="username">GitHub username</label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter a GitHub username..."
              autoComplete="off"
            />
            <button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className="spin" size={18} /> : <Search size={18} />}
              {loading ? 'Searching' : 'Find profile'}
            </button>
          </form>
          <div className="search-hint"><span className="hint-dot" /> Public profiles only · No sign-in required</div>
        </section>

        {loading && (
          <section className="status-panel" aria-live="polite">
            <LoaderCircle className="spin" size={28} />
            <strong>Finding developer...</strong>
            <span>Fetching profile and public repositories from GitHub.</span>
          </section>
        )}

        {!loading && error && (
          <section className="error-panel" role="alert">
            <AlertCircle size={22} />
            <div><strong>We couldn't complete that search</strong><p>{error}</p></div>
          </section>
        )}

        {!loading && profile && (
          <section className="results" aria-live="polite">
            <div className="section-heading">
              <div><span className="section-kicker">SEARCH RESULTS</span><h2>Developer profile</h2></div>
              <a className="outline-link" href={profile.html_url} target="_blank" rel="noreferrer">View on GitHub <ExternalLink size={15} /></a>
            </div>

            <article className="profile-card">
              <div className="profile-main">
                <img className="avatar" src={profile.avatar_url} alt={`${profile.login}'s GitHub avatar`} />
                <div className="profile-identity">
                  <div className="profile-name">{profile.name || profile.login}</div>
                  <a className="username" href={profile.html_url} target="_blank" rel="noreferrer">@{profile.login} <ExternalLink size={13} /></a>
                  <p className="bio">{profile.bio || 'This user has not added a bio yet.'}</p>
                  <div className="profile-meta">
                    {profile.location && <span><MapPin size={15} />{profile.location}</span>}
                    {profile.company && <span><Building2 size={15} />{profile.company}</span>}
                    {profile.blog && <a href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`} target="_blank" rel="noreferrer"><LinkIcon size={15} />Website</a>}
                  </div>
                </div>
              </div>
              <div className="stats-grid">
                <div className="stat"><BookOpen size={19} /><span>Public repos</span><strong>{formatNumber(profile.public_repos)}</strong></div>
                <div className="stat"><Users size={19} /><span>Followers</span><strong>{formatNumber(profile.followers)}</strong></div>
                <div className="stat"><Users size={19} /><span>Following</span><strong>{formatNumber(profile.following)}</strong></div>
              </div>
            </article>

            <div className="repo-heading">
              <div><span className="section-kicker">OPEN-SOURCE WORK</span><h2>Repositories <span className="count">{repos.length}</span></h2></div>
              <span className="sort-label">Recently updated</span>
            </div>

            {repos.length === 0 ? (
              <div className="empty-repos"><BookOpen size={25} /><strong>No public repositories found</strong><p>This profile doesn't have any public repositories to show.</p></div>
            ) : (
              <div className="repo-grid">
                {repos.map((repo) => (
                  <article className="repo-card" key={repo.id}>
                    <div className="repo-title-row">
                      <div className="repo-symbol"><Code2 size={18} /></div>
                      <a className="repo-title" href={repo.html_url} target="_blank" rel="noreferrer">{repo.name} <ExternalLink size={13} /></a>
                    </div>
                    <p className="repo-description">{repo.description || 'No description provided for this repository.'}</p>
                    <div className="repo-footer">
                      <span className="language">{repo.language && <><span className="language-dot" />{repo.language}</>}</span>
                      <span><Star size={14} /> {formatNumber(repo.stargazers_count)}</span>
                      <span><GitFork size={14} /> {formatNumber(repo.forks_count)}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
            <p className="results-note">Showing public repositories · Data provided by the GitHub REST API</p>
          </section>
        )}

        {!loading && !profile && !error && (
          <section className="welcome">
            <div className="welcome-icon"><Github size={34} /></div>
            <h2>{searched ? 'Ready for another search?' : 'Your next discovery starts here.'}</h2>
            <p>Try a username to view a developer profile and their latest public projects.</p>
            <div className="example-chips">
              <span>Try an example</span>
              {['octocat', 'torvalds', 'gaearon'].map((name) => (
                <button key={name} type="button" onClick={() => { setUsername(name); setTimeout(() => document.getElementById('username')?.focus(), 0) }}>{name}</button>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <span><Github size={16} /> Built for learning and exploring open source.</span>
        <span>Powered by GitHub REST API</span>
      </footer>
    </div>
  )
}

export default App