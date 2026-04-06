type Repo = `${string}/${string}`
type TimestampType = `${number}.${number}`

export const RepoLink = ({ repo, timestamp }: { repo: Repo; timestamp: TimestampType }) => {
  if (!repo || repo.split('/').length !== 2) {
    throw new Error('Invalid repo')
  }

  return (
    <span className="inline-flex items-center gap-1">
      <span className="bg-white font-mono font-bold h-fit px-1 text-sm!">{timestamp}</span>
      <a href={`https://github.com/${repo}`} target="_blank" rel="noopener">
        GitHub &gt; <code>{repo}</code>
      </a>
    </span>
  )
}
