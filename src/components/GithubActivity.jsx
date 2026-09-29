import { useEffect, useState } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { github, person } from '../content';
import ExternalLink from './ExternalLink';
import { useTheme } from '../hooks/useTheme';
import './GithubActivity.css';

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const WEEKDAYS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const HIDDEN = new Set([person.githubUser.toLowerCase()]);

const relative = new Intl.RelativeTimeFormat('es-AR', { numeric: 'auto' });

function sinceLabel(iso) {
  const days = Math.round((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return 'hoy';
  if (days < 30) return relative.format(-days, 'day');
  if (days < 365) return relative.format(-Math.round(days / 30), 'month');
  return relative.format(-Math.round(days / 365), 'year');
}

function useRecentRepos() {
  const [state, setState] = useState({ status: 'loading', repos: [] });

  useEffect(() => {
    const controller = new AbortController();
    fetch(`https://api.github.com/users/${person.githubUser}/repos?sort=pushed&per_page=20`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then((data) => {
        const repos = data.filter((r) => !r.fork && !HIDDEN.has(r.name.toLowerCase())).slice(0, 6);
        setState({ status: 'ready', repos });
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setState({ status: 'error', repos: [] });
      });
    return () => controller.abort();
  }, []);

  return state;
}

const GithubActivity = () => {
  const [theme] = useTheme();
  const { status, repos } = useRecentRepos();

  return (
    <section id="github" className="section ground-paper github" data-ground="paper" aria-labelledby="github-title">
      <div className="wrap">
        <header className="section-head">
          <h2 id="github-title" className="section-title">
            En GitHub
          </h2>
          <p className="section-sub">{github.intro}</p>
        </header>

        <div className="github-calendar">
          <GitHubCalendar
            username={person.githubUser}
            colorScheme={theme}
            blockSize={12}
            blockMargin={3}
            blockRadius={2}
            fontSize={13}
            theme={{
              light: ['#e2e5eb', '#b9bff0', '#7d87e3', '#3f4bd0', '#1c28b8'],
              dark: ['#1d2027', '#28307a', '#3643b4', '#6570ee', '#9aa2ff'],
            }}
            labels={{
              months: MONTHS,
              weekdays: WEEKDAYS,
              totalCount: '{{count}} contribuciones en el último año',
              legend: { less: 'Menos', more: 'Más' },
            }}
            errorMessage="No se pudo cargar el calendario de contribuciones."
          />
        </div>

        <div className="github-repos">
          {status === 'error' ? (
            <p className="github-error">
              No pude traer la lista desde GitHub en este momento. Están todos en{' '}
              <a href={person.github} target="_blank" rel="noopener noreferrer">
                github.com/{person.githubUser}
              </a>
              .
            </p>
          ) : (
            <ul className="repo-list" aria-label="Repositorios recientes" aria-busy={status === 'loading'}>
              {status === 'loading'
                ? Array.from({ length: 6 }, (_, i) => <li key={i} className="repo repo--skeleton" aria-hidden="true" />)
                : repos.map((r) => (
                    <li key={r.id} className="repo">
                      <a className="repo-name" href={r.html_url} target="_blank" rel="noopener noreferrer">
                        {r.name}
                      </a>
                      <span className="repo-lang">{r.language ?? '—'}</span>
                      <time className="repo-date" dateTime={r.pushed_at}>
                        {sinceLabel(r.pushed_at)}
                      </time>
                    </li>
                  ))}
            </ul>
          )}

          <p>
            <ExternalLink href={person.github} brand="github">
              Ver el perfil completo
            </ExternalLink>
          </p>
        </div>
      </div>
    </section>
  );
};

export default GithubActivity;
