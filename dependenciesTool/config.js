/**
 * Taulukko kansoista joiden riippuuvuuksia halutaan tarkastella.
 * Arvot abosluuttisina tiedostopolkuina.
 */
const folders = [
];

/**
 * Taulukko kansoista, joista tulevat riippuvuudet ovat kiellettyjä.
 * Annetun parametrin tule olla osa ES6 mukaisen importin sijaintia eli from jälkeistä osaa.
 * Ne riippuvuudet jätetään huomiotta, joissa riippuvuuden nimi esiintyy osana tiedoston absoluuttista tiedostopolkua.
 * Kirjainkoko huomioidaan (case sensitive)
 */
const forbiddenDependencies = [
];

/**
 * Tiedostot ja kansiot, jotka tarkastelussa halutaan ohittaa.
 * Arvot absoluuttisina tiedostopolkuina.
 */
const whitelist = [
];

module.exports = { folders, forbiddenDependencies, whitelist };
