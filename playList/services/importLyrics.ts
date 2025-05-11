/*export const importLyrics = async (artist: string, title: string) => {
  try {
    const searchResult = encodeURIComponent(`${artist} ${title}`);
    const response = await fetch(`https://api.genius.com/search?q=${searchResult}`, {
      headers: {
        Authorization: `Bearer YOUR_GENIUS_AUTHORITIZATION_TOKEN`, //Leave blank when pushing to GitHub
      },
    });
    const data = await response.json();
    const hit = data.response.hits[0];

    if (hit) {
      const songUrl = hit.result.url;
      return { lyrics: "Genius page", url: songUrl };
    } else {
      return { lyrics: null, url: null };
    }
  } catch (error) {
    console.error("Genius error", error);
    return { lyrics: null, url: null };
  }
};*/
