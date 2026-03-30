type Repo = `${string}/${string}`
type TimestampType = `${number}.${number}`

export function RepoLink({ repo, timestamp }: { repo: Repo; timestamp: TimestampType }) {
  if (!repo || repo.split('/').length !== 2) {
    throw new Error('Invalid repo')
  }

  return (
    <>
      <span className="font-bold font-mono mr-0.5 bg-white">{timestamp}</span>
      <a href={`https://github.com/${repo}`} target="_blank" rel="noopener">
        GitHub &gt; <code>{repo}</code>
      </a>
    </>
  )
}
