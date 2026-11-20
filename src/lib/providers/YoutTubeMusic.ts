import { CatalogProvider } from '../types'

export class ytMusicProvider implements CatalogProvider {
  public providerBaseURL = 'https://music.youtube.com/youtubei/v1'

  async search(searchQuery: string): Promise<string[]> {
    if (!searchQuery.trim()) return []

    const response = await fetch(
      `${this.providerBaseURL}/search?prettyPrint=false`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Origin: 'https://music.youtube.com',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: 'WEB_REMIX',
              clientVersion: '1.20261117.06.00',
              hl: 'en',
              gl: 'IT',
            },
          },
          query: searchQuery,
          params: 'EgWKAQIIAWoKEAoQAxAEEAkQBQ==',
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`)
    }

    const data = await response.json()

    // DEBUG: remove once it works
    console.log('yt raw:', JSON.stringify(data).slice(0, 1500))

    const tabs: any[] =
      data.contents?.tabbedSearchResultsRenderer?.tabs ?? []

    const songsTab = tabs.find(
      (tab: any) => tab.tabRenderer?.title?.toLowerCase() === 'songs'
    )

    const selectedTab = songsTab ?? tabs[0]

    const sections: any[] =
      selectedTab?.tabRenderer?.content?.sectionListRenderer?.contents ?? []

    const names: string[] = []

    // walk every section, not just the first musicShelfRenderer
    for (const section of sections) {
      const items: any[] = section.musicShelfRenderer?.contents ?? []

      for (const item of items) {
        const name =
          item.musicResponsiveListItemRenderer?.flexColumns?.[0]
            ?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.[0]?.text

        if (typeof name === 'string') names.push(name)
      }
    }

    return names
  }
}