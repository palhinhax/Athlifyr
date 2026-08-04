const LUZZO_AD_BASE_URL = "https://www.luzzo-eletronica.com/embed/anuncio";
const LUZZO_AD_THEME = "desporto-e-fitness";

export function buildLuzzoAdUrl(format: "faixa" | "retangulo") {
  const url = new URL(`${LUZZO_AD_BASE_URL}/${format}`);
  url.searchParams.set("tema", LUZZO_AD_THEME);

  return url.toString();
}
