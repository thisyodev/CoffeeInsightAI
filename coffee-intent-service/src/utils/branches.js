export const BRANCHES = {
  "asoke-01": {
    id: "asoke-01",
    name: "Asoke Junction",
    location_context: "Sukhumvit (Asoke Junction), Bangkok",
    coords: { lat: 13.7367, lng: 100.5604 },
    currentStore: {
      name: "CoffeeInsight Asoke",
      openingTime: "08:30",
      rating: 4.8,
    },
    competitors: [
      {
        name: "BARTELS Asok",
        openingTime: "07:00",
        rating: 4.5,
        distanceKm: 0.15,
      },
      {
        name: "Artis Coffee",
        openingTime: "07:00",
        rating: 4.2,
        distanceKm: 0.4,
      },
      { name: "Bru Cafe", openingTime: "07:00", rating: 4.5, distanceKm: 0.6 },
      {
        name: "PAGA Microroastery",
        openingTime: "08:00",
        rating: 4.2,
        distanceKm: 0.9,
      },
      { name: "Kuppa", openingTime: "10:00", rating: 3.8, distanceKm: 1.2 },
    ],
    hourlyDistribution: [
      { hour: "06:00", count: 40 },
      { hour: "07:00", count: 280 },
      { hour: "08:00", count: 560 },
      { hour: "09:00", count: 410 },
      { hour: "10:00", count: 220 },
    ],
    stats: {
      totalQueries: 2450,
      morningPercent: "72%",
      workPercent: "38%",
      peakHour: "08:45",
    },
  },
  "sukhumvit-24": {
    id: "sukhumvit-24",
    name: "Sukhumvit 24",
    location_context: "Phrom Phong (Sukhumvit 24), Bangkok",
    coords: { lat: 13.7298, lng: 100.5695 },
    currentStore: {
      name: "CoffeeInsight Phrom Phong",
      openingTime: "08:00",
      rating: 4.7,
    },
    competitors: [
      {
        name: "The Library",
        openingTime: "07:30",
        rating: 4.6,
        distanceKm: 0.2,
      },
      {
        name: "Holey Artisan Bakery",
        openingTime: "07:00",
        rating: 4.5,
        distanceKm: 0.5,
      },
      {
        name: "Starbucks Emporium",
        openingTime: "10:00",
        rating: 4.0,
        distanceKm: 0.3,
      },
    ],
    hourlyDistribution: [
      { hour: "06:00", count: 20 },
      { hour: "07:00", count: 180 },
      { hour: "08:00", count: 450 },
      { hour: "09:00", count: 580 },
      { hour: "10:00", count: 320 },
    ],
    stats: {
      totalQueries: 1800,
      morningPercent: "65%",
      workPercent: "45%",
      peakHour: "09:15",
    },
  },
  "siam-square": {
    id: "siam-square",
    name: "Siam Square",
    location_context: "Siam Square, Bangkok",
    coords: { lat: 13.7445, lng: 100.5312 },
    currentStore: {
      name: "CoffeeInsight Siam",
      openingTime: "10:00",
      rating: 4.9,
    },
    competitors: [
      {
        name: "Milch Siam",
        openingTime: "10:00",
        rating: 4.4,
        distanceKm: 0.1,
      },
      { name: "Heekcaa", openingTime: "10:30", rating: 4.3, distanceKm: 0.2 },
      { name: "KOI The", openingTime: "10:00", rating: 4.1, distanceKm: 0.15 },
    ],
    hourlyDistribution: [
      { hour: "09:00", count: 50 },
      { hour: "10:00", count: 350 },
      { hour: "11:00", count: 620 },
      { hour: "12:00", count: 850 },
      { hour: "13:00", count: 720 },
    ],
    stats: {
      totalQueries: 5200,
      morningPercent: "15%",
      workPercent: "25%",
      peakHour: "12:30",
    },
  },
  "ari-01": {
    id: "ari-01",
    name: "Ari District",
    location_context: "Phahonyothin (Ari Area), Bangkok",
    coords: { lat: 13.7797, lng: 100.5447 },
    currentStore: {
      name: "CoffeeInsight Ari",
      openingTime: "08:00",
      rating: 4.7,
    },
    competitors: [
      {
        name: "Nana Coffee Roasters Ari",
        openingTime: "07:00",
        rating: 4.6,
        distanceKm: 0.2,
      },
      {
        name: "Common Room x Ari",
        openingTime: "08:00",
        rating: 4.4,
        distanceKm: 0.3,
      },
      {
        name: "Yellow Stuff",
        openingTime: "09:00",
        rating: 4.3,
        distanceKm: 0.5,
      },
      {
        name: "Laliart Coffee",
        openingTime: "10:00",
        rating: 4.6,
        distanceKm: 0.8,
      },
    ],
    hourlyDistribution: [
      { hour: "06:00", count: 15 },
      { hour: "07:00", count: 120 },
      { hour: "08:00", count: 310 },
      { hour: "09:00", count: 480 },
      { hour: "10:00", count: 350 },
      { hour: "11:00", count: 280 },
    ],
    stats: {
      totalQueries: 2100,
      morningPercent: "58%",
      workPercent: "42%",
      peakHour: "09:30",
    },
  },
  "sam-chuk": {
    id: "sam-chuk",
    name: "Sam Chuk",
    location_context: "Sam Chuk, Suphan Buri",
    coords: { lat: 14.7937, lng: 100.1076 },
    currentStore: {
      name: "CoffeeInsight Sam Chuk",
      openingTime: "08:00",
      rating: 4.5,
    },
    competitors: [
      {
        name: "Local Roaster",
        openingTime: "07:30",
        rating: 4.6,
        distanceKm: 0.12,
      },
      {
        name: "Commercial Chain",
        openingTime: "06:30",
        rating: 4.1,
        distanceKm: 0.25,
      },
      {
        name: "Artisan Cafe",
        openingTime: "08:00",
        rating: 4.3,
        distanceKm: 0.35,
      },
      {
        name: "Local Brew House",
        openingTime: "07:00",
        rating: 4.2,
        distanceKm: 0.8,
      },
    ],
    hourlyDistribution: [
      { hour: "06:00", count: 25 },
      { hour: "07:00", count: 150 },
      { hour: "08:00", count: 380 },
      { hour: "09:00", count: 420 },
      { hour: "10:00", count: 280 },
    ],
    stats: {
      totalQueries: 1650,
      morningPercent: "62%",
      workPercent: "40%",
      peakHour: "08:45",
    },
  },
};

export const getBranchById = (id) => {
  // Map friendly names to IDs if needed
  const normalizedId = id.toLowerCase().replace(/ /g, "-");
  return BRANCHES[normalizedId] || BRANCHES["asoke-01"];
};
