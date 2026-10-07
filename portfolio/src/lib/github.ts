import { useEffect, useState } from 'react';

export const GITHUB_USER = 'SanTiwari07';

export type GithubRepo = { html_url: string; stargazers_count: number };
export type GithubData = { repos: GithubRepo[]; publicRepos: number; stars: number };

const CACHE_KEY = 'gh-data-v1';
const CACHE_TTL = 30 * 60 * 1000;

let inflight: Promise<GithubData> | null = null;

const readCache = (): GithubData | null => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { t, d } = JSON.parse(raw) as { t: number; d: GithubData };
    return Date.now() - t < CACHE_TTL ? d : null;
  } catch {
    return null;
  }
};

function fetchGithub(): Promise<GithubData> {
  inflight ??= fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&type=owner`)
    .then((res) => {
      if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
      return res.json();
    })
    .then((data: GithubRepo[]) => {
      if (!Array.isArray(data)) throw new Error('Unexpected GitHub response');
      const d: GithubData = {
        repos: data,
        publicRepos: data.length,
        stars: data.reduce((acc, r) => acc + (r.stargazers_count || 0), 0),
      };
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), d }));
      } catch {
        /* storage unavailable */
      }
      return d;
    })
    .catch((err) => {
      inflight = null;
      throw err;
    });
  return inflight;
}

/** Live GitHub data (shared request, cached per session). Null until loaded or if the API is unavailable. */
export function useGithubData(): GithubData | null {
  const [data, setData] = useState<GithubData | null>(readCache);

  useEffect(() => {
    let alive = true;
    fetchGithub()
      .then((d) => alive && setData(d))
      .catch(() => console.warn('GitHub API unavailable, using fallback data'));
    return () => {
      alive = false;
    };
  }, []);

  return data;
}
