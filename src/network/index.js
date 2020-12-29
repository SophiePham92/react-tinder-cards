import { skimProfileData } from "../utilities";

export async function getProfilesData() {
  const response = await fetch("https://randomuser.me/api/?results=5");
  const { results } = await response.json();
  return skimProfileData(results);
}
