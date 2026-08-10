/**
 * The landing page's food photography.
 *
 * Every recipe card, cookbook cover and library tile on this page used to be
 * a green gradient rectangle. On a marketplace whose entire proposition is
 * "chef-tested food", a page with no food on it is the single loudest tell
 * that nothing behind it is real — and it left the whole page tinted one
 * flat hue, because the placeholders *were* the accent colour.
 *
 * These are the real assets in the project's Cloudinary account
 * (cloud `djgwnvlrb`, folder `recipe_images`). The dish names are matched to
 * what is actually in each photograph — a picture of biryani is not labelled
 * "Cacio e pepe". That correspondence is the point: it is what stops the
 * section reading as filler.
 */

const CLOUD = "djgwnvlrb";

/**
 * Cloudinary handles the resizing, so a 900px hero thumbnail and a 96px row
 * thumbnail are different bytes rather than the same file scaled in CSS.
 * `g_auto` keeps the dish centred when the crop is tight.
 */
export function cld(
  id: string,
  { w, h, q = "auto" }: { w: number; h: number; q?: string },
) {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_${q},c_fill,g_auto,w_${w},h_${h}/${id}`;
}

export type Dish = {
  id: string;
  name: string;
  chef: string;
  time: string;
  rating: string;
};

/**
 * Ordered roughly by how well each frame survives being cropped small — the
 * first entries are the ones used at thumbnail size.
 */
export const DISHES: Dish[] = [
  {
    id: "recipe_images/jljztkycfbknw2yko7eu",
    name: "Chicken karahi",
    chef: "Amara Osei",
    time: "32 min",
    rating: "4.9",
  },
  {
    // Verified against the photograph: rice with raisins, chickpeas and
    // dried apricot around chunks of lamb, in a wooden bowl. That is a plov,
    // not the layered biryani this was previously labelled.
    id: "recipe_images/hoxhzt40tjfhwonqxukb",
    name: "Lamb plov",
    chef: "Yuki Tanaka",
    time: "75 min",
    rating: "4.9",
  },
  {
    id: "recipe_images/oi9za2yrlylohrl9vhvb",
    name: "Chicken alfredo",
    chef: "Lina Ferrari",
    time: "25 min",
    rating: "4.8",
  },
  {
    // Bone-in thighs and drumsticks in a red tomato gravy, coriander over
    // the top — a chicken curry. Butter chicken is boneless in a cream
    // sauce, so that name was describing a different dish.
    id: "recipe_images/ryyyvqi7ugrvjbn19vu9",
    name: "Chicken curry",
    chef: "Marco Rivera",
    time: "40 min",
    rating: "4.8",
  },
  {
    id: "recipe_images/hi6xinq7947rdcg8vwaw",
    name: "Kabuli pulao",
    chef: "Amara Osei",
    time: "65 min",
    rating: "4.7",
  },
  {
    // A single chocolate macaron with a chocolate drizzle, shot top-down.
    // Not a torte.
    id: "recipe_images/b2st8yzq9jgqljrffmz2",
    name: "Chocolate macaron",
    chef: "Lina Ferrari",
    time: "35 min",
    rating: "4.9",
  },
  {
    id: "recipe_images/zczum3m0k7lvqifxvv1z",
    name: "Lamb chops, saffron rice",
    chef: "Marco Rivera",
    time: "45 min",
    rating: "4.9",
  },
  {
    id: "recipe_images/qw4nt7jlocsawu7mr9vy",
    name: "Kadai chicken",
    chef: "Yuki Tanaka",
    time: "28 min",
    rating: "4.7",
  },
  {
    id: "recipe_images/ypgj2d1amtskxjqvgmb2",
    name: "Seared duck, plated",
    chef: "Marco Rivera",
    time: "40 min",
    rating: "4.8",
  },
  {
    id: "recipe_images/na75z7hcrlnjqupeofux",
    name: "Rack of lamb",
    chef: "Lina Ferrari",
    time: "55 min",
    rating: "5.0",
  },
  {
    id: "recipe_images/vsb86t7wsz8fxhpqig13",
    name: "Beef pilaf",
    chef: "Amara Osei",
    time: "50 min",
    rating: "4.6",
  },
  {
    id: "recipe_images/wqyx24yruetsfsxzde5f",
    name: "Carrot and raisin pulao",
    chef: "Yuki Tanaka",
    time: "55 min",
    rating: "4.7",
  },
];

const byId = (id: string) => DISHES.find((d) => d.id.endsWith(id))!;

/**
 * The people whose names sit on the dishes.
 *
 * The same four appear everywhere on the page — recipe rows, cookbook
 * covers, testimonials, the chef grid. A marketplace with a fresh cast in
 * every section is the tell that none of them exist; reusing four means the
 * bylines cross-reference each other, which is what a real roster does.
 */
export type Chef = {
  name: string;
  kitchen: string;
  focus: string;
  recipes: number;
  avatar: string;
};

export const CHEFS: Chef[] = [
  {
    name: "Marco Rivera",
    kitchen: "Lisbon",
    focus: "Modern Iberian",
    recipes: 48,
    avatar: "profile_pictures/dinswstuu3n8kywxcyik",
  },
  {
    name: "Amara Osei",
    kitchen: "Accra",
    focus: "West African",
    recipes: 36,
    avatar: "profile_pictures/nhsmxspcuf66rmg5xlsv",
  },
  {
    name: "Yuki Tanaka",
    kitchen: "Osaka",
    focus: "Rice and pilaf",
    recipes: 29,
    avatar: "profile_pictures/xkc4ykbvoxgjlqbobyxa",
  },
  {
    name: "Lina Ferrari",
    kitchen: "Bologna",
    focus: "Pastry",
    recipes: 41,
    avatar: "profile_pictures/wbdbvjrzxwuee9p2vt7x",
  },
];

export const chefByName = (name: string) => CHEFS.find((c) => c.name === name)!;

/** Cookbooks are covers first — the title is what you read second. */
export const COOKBOOKS = [
  {
    title: "Weeknight Curry",
    price: "$24",
    recipes: "12 recipes",
    cover: byId("jljztkycfbknw2yko7eu").id,
  },
  {
    title: "Rice & Pilaf",
    price: "$32",
    recipes: "9 recipes",
    cover: byId("hoxhzt40tjfhwonqxukb").id,
  },
  {
    title: "Sweet Finishes",
    price: "$18",
    recipes: "6 recipes",
    cover: byId("b2st8yzq9jgqljrffmz2").id,
  },
];

/**
 * The auth pages' brand panels.
 *
 * The image and its caption are one object on purpose. They were previously
 * two independent things — a swappable `imageSrc` prop next to a hardcoded
 * credit — and they drifted immediately: the register page passes its own
 * photograph, so a steak sat under the words "Lamb biryani". Binding them
 * together means a page picks a panel, not a picture, and the caption cannot
 * describe something else.
 *
 * One per screen rather than one for all of them, so signing up and signing
 * in are not the same wall.
 */
export type AuthPanel = {
  id: string;
  name: string;
  chef: string;
  time: string;
  rating: string;
  alt: string;
};

const fromDish = (d: Dish, alt: string): AuthPanel => ({ ...d, alt });

export const AUTH_PANELS = {
  login: fromDish(
    byId("hoxhzt40tjfhwonqxukb"),
    "A wooden bowl of lamb plov — saffron rice studded with raisins, chickpeas and dried apricot — beside bowls of peppercorns and salt",
  ),
  register: {
    // Not in `recipe_images`: a separate upload, shot monochrome against
    // black. `cld` takes any public id, so it resizes the same way.
    id: "register_eu7mjh",
    name: "Grilled fillet, rosemary",
    chef: "Marco Rivera",
    time: "22 min",
    rating: "4.9",
    alt: "A thick grilled beef fillet finished with rosemary and a whole head of garlic, plated dark with a glass of red behind it",
  } satisfies AuthPanel,
  recover: fromDish(
    byId("b2st8yzq9jgqljrffmz2"),
    "A single chocolate macaron under a chocolate drizzle, shot from directly above",
  ),
  verify: fromDish(
    byId("ypgj2d1amtskxjqvgmb2"),
    "Sauce being poured over seared duck breast and a potato fondant, steam still rising",
  ),
} satisfies Record<string, AuthPanel>;

/**
 * Scene photography — the two frames that carry a whole section rather than
 * sitting inside a card.
 *
 * These are the sections that were still flat accent-green slabs after the
 * card work: a quote panel, a closing panel. Both were the same move (fill a
 * rectangle with the brand colour and set type on it), and three of them down
 * one page is what made the whole thing read as one tinted hue. A photograph
 * carries a panel that size better than a gradient does, and on this product
 * it also happens to be the proof.
 */
export const SCENES = {
  /**
   * A chef finishing a plate. Shot monochrome, which is why it can sit near
   * the food cards without competing with them — it adds tonal range instead
   * of a second colour. It was already in the project, used at 44px as an
   * avatar; it is a far better photograph than that crop admitted.
   */
  kitchen: "about-us_mrtdt2",
  /** The closing frame. Dark, spotlit, steam still coming off the sauce. */
  closing: byId("ypgj2d1amtskxjqvgmb2").id,
} as const;
