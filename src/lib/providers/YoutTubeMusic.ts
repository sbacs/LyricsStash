import { CatalogProvider, Track } from "../types";

export class ytMusicProvider implements CatalogProvider {
  public providerBaseURL = "https://music.youtube.com/youtubei/v1";

  async search(searchQuery: string): Promise<Track[]> {
    if (!searchQuery.trim()) return [];

    const response = await fetch(
      `${this.providerBaseURL}/search?prettyPrint=false`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: "https://music.youtube.com",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: "WEB_REMIX",
              clientVersion: "1.20261117.06.00",
              hl: "en",
              gl: "IT",
            },
          },
          query: searchQuery,
          params: "EgWKAQIIAWoKEAoQAxAEEAkQBQ==",
        }),
      },
    );

    if (!response.ok) throw new Error("Response not Ok");

    const data = await response.json();

    const sections =
      data.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content
        .sectionListRenderer.contents;

    const tracksContainer = sections.find((o: any) => o.musicShelfRenderer)
      ?.musicShelfRenderer?.contents;

    if (!tracksContainer) throw new Error("Response not Ok");

    return tracksContainer.map((c: any) => {
      return {
        name: c.musicResponsiveListItemRenderer.flexColumns[0]
          .musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
        artists:
          c.musicResponsiveListItemRenderer.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs
            .filter(
              (r: any) =>
                r.navigationEndpoint?.browseEndpoint
                  ?.browseEndpointContextSupportedConfigs
                  ?.browseEndpointContextMusicConfig?.pageType ===
                "MUSIC_PAGE_TYPE_ARTIST",
            )
            .map((f: any) => ({ name: f.text })),
        release: {
          photo_path:
            c.musicResponsiveListItemRenderer.thumbnail.musicThumbnailRenderer
              .thumbnail.thumbnails[1].url,
        },
      };
    });
  }
}
