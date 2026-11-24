import { DemandLevel, Language, SectionId } from '../types/farm';

export interface AppStrings {
  brandName: string;
  brandSubtitle: string;
  languageLabel: string;
  searchPlaceholder: string;
  clearSearch: string;
  recentSearches: string;
  noSearchResults: string;
  searchHint: string;
  nav: Record<SectionId, string>;
  demand: Record<DemandLevel, string>;
  common: {
    selectCrop: string;
    selected: string;
    viewDetails: string;
    compareMarkets: string;
    calculateProfit: string;
    save: string;
    saved: string;
    remove: string;
    refresh: string;
    loading: string;
    retry: string;
    perKg: string;
    perQuintal: string;
    kg: string;
    quintal: string;
    lastUpdated: string;
    dataSource: string;
    sampleDataTag: string;
    liveAgmarknetTag: string;
    liveWeatherTag: string;
    estimateTag: string;
    addFavorite: string;
    removeFavorite: string;
    all: string;
    vegetables: string;
    otherCrops: string;
    close: string;
  };
  dashboard: {
    heroHeadline: string;
    heroBody: string;
    ctaCompare: string;
    ctaProfit: string;
    quickCropTitle: string;
    quickCropPrompt: string;
    previewReadyLabel: string;
    openFullCard: string;
    servicesHeading: string;
    servicesSubheading: string;
    serviceDescriptions: {
      cropInfo: string;
      marketPrices: string;
      marketComparison: string;
      profitCalculator: string;
      weather: string;
      voiceAssistant: string;
    };
    activeAlertsBanner: string;
    viewAlerts: string;
  };
  cropInfo: {
    title: string;
    subtitle: string;
    choosePrompt: string;
    fields: {
      cropName: string;
      cropQuality: string;
      availableQuantity: string;
      currentMarketPrice: string;
      marketLocation: string;
      priceComparison: string;
      marketDemand: string;
      expectedSellingPrice: string;
      lastUpdatedPrice: string;
    };
    historyTitle: string;
    storageTitle: string;
    harvestSeasonLabel: string;
    shelfLifeLabel: string;
    daysUnit: string;
  };
  marketPrices: {
    title: string;
    subtitle: string;
    filterByState: string;
    filterByCrop: string;
    allStates: string;
    allCrops: string;
    tableHeaders: {
      crop: string;
      market: string;
      location: string;
      priceKg: string;
      priceQuintal: string;
      demand: string;
      updated: string;
      action: string;
    };
    noMatches: string;
  };
  marketComparison: {
    title: string;
    subtitle: string;
    chooseCropLabel: string;
    highestMarket: string;
    lowestMarket: string;
    priceSpread: string;
    highestTag: string;
    lowestTag: string;
    useInCalculator: string;
    sortByPriceDesc: string;
    sortByPriceAsc: string;
  };
  profitCalc: {
    title: string;
    subtitle: string;
    estimateDisclaimer: string;
    inputsTitle: string;
    resultsTitle: string;
    cropLabel: string;
    quantityLabel: string;
    unitLabel: string;
    sellingPriceLabel: string;
    productionCostLabel: string;
    transportCostLabel: string;
    loadingCostLabel: string;
    otherExpensesLabel: string;
    localMarketLabel: string;
    destinationMarketLabel: string;
    autoFillRate: string;
    resetForm: string;
    metrics: {
      totalRevenue: string;
      totalExpenses: string;
      netProfit: string;
      profitPerKg: string;
      totalTransport: string;
      profitMargin: string;
    };
    comparisonTitle: string;
    localSellingLabel: string;
    destinationSellingLabel: string;
    verdictHigher: string;
    verdictLower: string;
    verdictEqual: string;
    validationError: string;
  };
  weather: {
    title: string;
    subtitle: string;
    locationInputPlaceholder: string;
    checkWeatherBtn: string;
    useSavedLocationBtn: string;
    quickCitiesLabel: string;
    currentTemp: string;
    feelsLike: string;
    condition: string;
    rainProbability: string;
    humidity: string;
    windSpeed: string;
    forecastTitle: string;
    advisoryTitle: string;
    advisoryRain: string;
    advisoryHeat: string;
    advisoryClear: string;
    unavailableMessage: string;
  };
  voice: {
    title: string;
    subtitle: string;
    honestyNote: string;
    micStart: string;
    micStop: string;
    micListening: string;
    micUnsupported: string;
    speakToggle: string;
    stopSpeaking: string;
    inputPlaceholder: string;
    sendBtn: string;
    sampleQuestionsTitle: string;
    sampleQuestions: string[];
    welcomeMessage: string;
  };
  products: {
    title: string;
    subtitle: string;
    varietyLabel: string;
    gradeLabel: string;
    basePriceLabel: string;
    shelfLifeLabel: string;
  };
  favorites: {
    title: string;
    subtitle: string;
    favoriteCropsTitle: string;
    favoriteMarketsTitle: string;
    noFavoriteCrops: string;
    noFavoriteMarkets: string;
    alertsTitle: string;
    alertCropLabel: string;
    alertTargetLabel: string;
    addAlertBtn: string;
    notificationsTitle: string;
    noNotifications: string;
    markAllRead: string;
    recentSearchesTitle: string;
    clearRecent: string;
    noRecentSearches: string;
  };
  profile: {
    title: string;
    subtitle: string;
    farmerDetailsTitle: string;
    nameLabel: string;
    locationLabel: string;
    stateLabel: string;
    farmSizeLabel: string;
    notesLabel: string;
    saveProfileBtn: string;
    profileSavedToast: string;
    helpTitle: string;
    faqs: Array<{ q: string; a: string }>;
    aboutTitle: string;
    aboutBody: string;
    dataPolicyTitle: string;
    dataPolicyBody: string;
  };
}

export const TRANSLATIONS: Record<Language, AppStrings> = {
  en: {
    brandName: 'Smart Farmer',
    brandSubtitle: 'Agricultural Market & Profit Assistance',
    languageLabel: 'Language',
    searchPlaceholder: 'Search crops, markets, locations, or demand...',
    clearSearch: 'Clear',
    recentSearches: 'Recent Searches',
    noSearchResults: 'No matching crops or markets found.',
    searchHint: 'Select a result to inspect its full market details.',
    nav: {
      dashboard: 'Dashboard',
      'crop-info': 'Crop Information',
      'market-prices': 'Market Prices',
      'market-comparison': 'Market Comparison',
      'profit-calculator': 'Profit Calculator',
      weather: 'Weather Report',
      'voice-assistant': 'AI Voice Assistant',
      products: 'Products',
      favorites: 'Favorites',
      profile: 'Profile',
    },
    demand: {
      high: 'High Demand',
      moderate: 'Moderate Demand',
      steady: 'Steady Demand',
    },
    common: {
      selectCrop: 'Select Crop',
      selected: 'Selected',
      viewDetails: 'View Details',
      compareMarkets: 'Compare Markets',
      calculateProfit: 'Estimate Profit',
      save: 'Save',
      saved: 'Saved',
      remove: 'Remove',
      refresh: 'Refresh',
      loading: 'Loading...',
      retry: 'Try Again',
      perKg: '/ kg',
      perQuintal: '/ qtl',
      kg: 'Kg',
      quintal: 'Quintal',
      lastUpdated: 'Last Updated',
      dataSource: 'Source',
      sampleDataTag: 'Sample Reference Data',
      liveAgmarknetTag: 'Live AGMARKNET',
      liveWeatherTag: 'Open-Meteo Live Weather',
      estimateTag: 'Estimate',
      addFavorite: 'Save to Favorites',
      removeFavorite: 'Saved in Favorites',
      all: 'All',
      vegetables: 'Vegetables',
      otherCrops: 'Other Crops',
      close: 'Close',
    },
    dashboard: {
      heroHeadline: 'Make profitable selling decisions with clear mandi intelligence.',
      heroBody:
        'Select a crop below to view prices, compare nearby and interstate markets, estimate net profit after transport, or check live weather before harvest.',
      ctaCompare: 'Compare Markets',
      ctaProfit: 'Profit Calculator',
      quickCropTitle: 'Select a Crop to Inspect',
      quickCropPrompt: 'Details remain hidden until you choose a crop below.',
      previewReadyLabel: 'Crop Summary',
      openFullCard: 'Open Full Crop Card',
      servicesHeading: 'Farmer Decision Tools',
      servicesSubheading: 'Open any tool below when you are ready.',
      serviceDescriptions: {
        cropInfo: 'Inspect quality grades, demand, expected selling rates, and 7-day history.',
        marketPrices: 'Browse mandi prices across Tamil Nadu, Karnataka, Maharashtra, and Delhi.',
        marketComparison: 'Spot the highest and lowest mandi prices per kg and per quintal.',
        profitCalculator: 'Calculate net profit after transport, loading, and production costs.',
        weather: 'Live temperature, rain probability, humidity, wind, and 5-day forecast.',
        voiceAssistant: 'Ask questions by voice or text in English, Tamil, or Hindi.',
      },
      activeAlertsBanner: 'Price alert targets matched in current market rates.',
      viewAlerts: 'View Notifications',
    },
    cropInfo: {
      title: 'Crop Information',
      subtitle: 'Choose a vegetable or crop below to reveal its complete 9-point market profile.',
      choosePrompt: 'Select a crop card above to view detailed market intelligence.',
      fields: {
        cropName: 'Crop Name',
        cropQuality: 'Crop Quality',
        availableQuantity: 'Available Quantity',
        currentMarketPrice: 'Current Market Price',
        marketLocation: 'Market Location',
        priceComparison: 'Market Price Comparison',
        marketDemand: 'Market Demand',
        expectedSellingPrice: 'Expected Selling Price',
        lastUpdatedPrice: 'Last Updated Price',
      },
      historyTitle: '7-Day Reference Price Trend (₹/kg)',
      storageTitle: 'Handling & Storage Guidance',
      harvestSeasonLabel: 'Harvest Window',
      shelfLifeLabel: 'Typical Shelf Life',
      daysUnit: 'days',
    },
    marketPrices: {
      title: 'Market Prices',
      subtitle: 'Current wholesale rates across agricultural markets.',
      filterByState: 'Filter by State',
      filterByCrop: 'Filter by Crop',
      allStates: 'All States',
      allCrops: 'All Crops',
      tableHeaders: {
        crop: 'Crop',
        market: 'Market Name',
        location: 'Location',
        priceKg: 'Price / Kg',
        priceQuintal: 'Price / Quintal',
        demand: 'Demand',
        updated: 'Last Updated',
        action: 'Action',
      },
      noMatches: 'No market quotes match the selected filters.',
    },
    marketComparison: {
      title: 'Market Price Comparison',
      subtitle: 'Compare prices of one crop across multiple mandis to identify profitable destinations.',
      chooseCropLabel: 'Select Crop to Compare',
      highestMarket: 'Highest Available Price',
      lowestMarket: 'Lowest Available Price',
      priceSpread: 'Market Spread',
      highestTag: 'Highest Price',
      lowestTag: 'Lowest Price',
      useInCalculator: 'Use in Profit Calculator',
      sortByPriceDesc: 'Highest to Lowest',
      sortByPriceAsc: 'Lowest to Highest',
    },
    profitCalc: {
      title: 'Profit Calculator',
      subtitle: 'Estimate net profit after production, transportation, loading, and other expenses.',
      estimateDisclaimer:
        'All calculations shown below are financial estimates based on your entered quantities, costs, and selected market prices.',
      inputsTitle: 'Harvest & Cost Inputs',
      resultsTitle: 'Estimated Profit Breakdown',
      cropLabel: 'Selected Crop',
      quantityLabel: 'Available Quantity',
      unitLabel: 'Unit',
      sellingPriceLabel: 'Expected Selling Price (₹ / Kg)',
      productionCostLabel: 'Production / Purchase Cost (Total ₹)',
      transportCostLabel: 'Transportation Cost (Total ₹)',
      loadingCostLabel: 'Loading & Unloading Cost (Total ₹)',
      otherExpensesLabel: 'Other Expenses (Mandi Fee, Packaging ₹)',
      localMarketLabel: 'Local Market (Baseline)',
      destinationMarketLabel: 'Destination Market',
      autoFillRate: 'Use Destination Rate',
      resetForm: 'Reset',
      metrics: {
        totalRevenue: 'Estimated Total Revenue',
        totalExpenses: 'Estimated Total Expenses',
        netProfit: 'Estimated Net Profit',
        profitPerKg: 'Estimated Profit per Kg',
        totalTransport: 'Total Transport & Handling',
        profitMargin: 'Estimated Profit Margin',
      },
      comparisonTitle: 'Local vs. Destination Market Comparison (Estimate)',
      localSellingLabel: 'Selling Locally',
      destinationSellingLabel: 'Selling at Destination Market',
      verdictHigher: 'Selected destination market offers a higher estimated net profit.',
      verdictLower: 'Selling locally is estimated to be more profitable after extra transport costs.',
      verdictEqual: 'Both markets yield roughly the same estimated net profit.',
      validationError: 'Please enter valid non-negative numbers and a quantity greater than 0.',
    },
    weather: {
      title: 'Weather Report',
      subtitle: 'Live location-based weather and 5-day agricultural forecast powered by Open-Meteo.',
      locationInputPlaceholder: 'Enter town, village, or mandi city (e.g., Coimbatore, Nashik)...',
      checkWeatherBtn: 'Check Weather',
      useSavedLocationBtn: 'Use Saved Location',
      quickCitiesLabel: 'Quick Mandi Hubs:',
      currentTemp: 'Current Temperature',
      feelsLike: 'Feels Like',
      condition: 'Condition',
      rainProbability: 'Rain Probability',
      humidity: 'Humidity',
      windSpeed: 'Wind Speed',
      forecastTitle: '5-Day Weather Forecast',
      advisoryTitle: 'Harvest & Transport Weather Note',
      advisoryRain: 'Rain probability is elevated. Cover produce during loading and prefer waterproof tarpaulins in transit.',
      advisoryHeat: 'Warm conditions ahead. Harvest delicate leafy and fruiting crops early morning and keep shaded.',
      advisoryClear: 'Favorable dry conditions for harvesting, sun-curing, and highway mandi transport.',
      unavailableMessage: 'Live weather data is currently unavailable for this location.',
    },
    voice: {
      title: 'AI Voice Assistant',
      subtitle: 'Speak or type in English, Tamil, or Hindi to ask about crop prices, markets, profit, or weather.',
      honestyNote:
        'Uses browser speech recognition for voice capture paired with server-side Gemini AI grounded in the active market and weather data.',
      micStart: 'Start Voice Input',
      micStop: 'Stop Listening',
      micListening: 'Listening... Speak clearly now',
      micUnsupported: 'Voice microphone capture is unavailable in this browser. Type your question below.',
      speakToggle: 'Read Replies Aloud',
      stopSpeaking: 'Stop Audio',
      inputPlaceholder: 'Ask about tomato price, onion profit, or weather...',
      sendBtn: 'Ask Assistant',
      sampleQuestionsTitle: 'Try Asking:',
      sampleQuestions: [
        'Which market offers the highest price for Tomato today?',
        'Compare Onion prices between Nashik and Chennai.',
        'How should I plan transport if rain is expected tomorrow?',
        'What expenses reduce net profit in the calculator?',
      ],
      welcomeMessage:
        'Hello! I am your Smart Farmer assistant. Ask me about crop prices, best mandis to sell in, transport profit estimates, or weather conditions.',
    },
    products: {
      title: 'Agricultural Products & Varieties',
      subtitle: 'Browse supported vegetables, grains, fruits, and spices with quality grading standards.',
      varietyLabel: 'Common Variety',
      gradeLabel: 'Quality Grade',
      basePriceLabel: 'Reference Rate',
      shelfLifeLabel: 'Shelf Life',
    },
    favorites: {
      title: 'Favorites, Alerts & Recent Activity',
      subtitle: 'Manage your saved crops, preferred mandis, recent searches, and target price notifications.',
      favoriteCropsTitle: 'Favorite Crops',
      favoriteMarketsTitle: 'Favorite Markets',
      noFavoriteCrops: 'No favorite crops saved yet. Open Crop Information to save crops.',
      noFavoriteMarkets: 'No favorite markets saved yet. Open Market Comparison to bookmark mandis.',
      alertsTitle: 'Price Update Notifications & Alerts',
      alertCropLabel: 'Crop',
      alertTargetLabel: 'Target Price (₹ / Kg)',
      addAlertBtn: 'Create Price Alert',
      notificationsTitle: 'Triggered Price Notifications',
      noNotifications: 'No price targets triggered right now.',
      markAllRead: 'Mark All Read',
      recentSearchesTitle: 'Recent Searches',
      clearRecent: 'Clear History',
      noRecentSearches: 'Your recent search history is empty.',
    },
    profile: {
      title: 'Farmer Profile, Settings & Support',
      subtitle: 'Configure your default farm location, manage preferences, and review data transparency.',
      farmerDetailsTitle: 'Farmer Profile & Location Settings',
      nameLabel: 'Farmer Name',
      locationLabel: 'Default Village / Town / City',
      stateLabel: 'State',
      farmSizeLabel: 'Farm Size (Acres)',
      notesLabel: 'Preferred Mandis or Crop Notes',
      saveProfileBtn: 'Save Profile',
      profileSavedToast: 'Profile and default location saved.',
      helpTitle: 'Help & Support',
      faqs: [
        {
          q: 'Are the market prices live or sample data?',
          a: 'Every price table clearly displays its source. When a data.gov.in AGMARKNET key is configured on the server, live daily mandi quotes are shown; otherwise, Smart Farmer displays a clearly labeled Sample Reference Dataset.',
        },
        {
          q: 'How is Net Profit calculated?',
          a: 'Net Profit equals Total Revenue (Quantity × Selling Price) minus Production Cost, Transportation Cost, Loading/Unloading Cost, and Other Expenses. All results are marked as estimates.',
        },
        {
          q: 'Does the AI Voice Assistant work in Tamil and Hindi?',
          a: 'Yes. Switch the header language to Tamil or Hindi to speak and receive Gemini-powered agricultural responses in your chosen language.',
        },
      ],
      aboutTitle: 'About Smart Farmer',
      aboutBody:
        'Smart Farmer is an agricultural market intelligence and decision-support platform designed to help farmers compare mandi prices transparently, evaluate transportation trade-offs, monitor live weather, and boost net farm income.',
      dataPolicyTitle: 'Data Accuracy & Attribution',
      dataPolicyBody:
        'Live weather reports are powered by Open-Meteo. Official Indian mandi integration targets the Open Government Data Platform India (AGMARKNET). Sample reference prices are strictly illustrative baselines and never presented as real-time quotes.',
    },
  },

  ta: {
    brandName: 'ஸ்மார்ட் ஃபார்மர்',
    brandSubtitle: 'வேளாண் சந்தை மற்றும் லாப ஆலோசனைத் தளம்',
    languageLabel: 'மொழி',
    searchPlaceholder: 'பயிர், சந்தை, இடம் அல்லது தேவையைத் தேடுங்கள்...',
    clearSearch: 'அழி',
    recentSearches: 'சமீபத்திய தேடல்கள்',
    noSearchResults: 'பொருத்தமான பயிர் அல்லது சந்தை இல்லை.',
    searchHint: 'முழு சந்தை விவரங்களைக் காண ஒரு முடிவைத் தேர்ந்தெடுக்கவும்.',
    nav: {
      dashboard: 'முகப்பு',
      'crop-info': 'பயிர் விவரங்கள்',
      'market-prices': 'சந்தை விலைகள்',
      'market-comparison': 'சந்தை ஒப்பீடு',
      'profit-calculator': 'லாபக் கணிப்பான்',
      weather: 'வானிலை அறிக்கை',
      'voice-assistant': 'AI குரல் உதவியாளர்',
      products: 'பொருட்கள்',
      favorites: 'விருப்பங்கள்',
      profile: 'சுயவிவரம்',
    },
    demand: {
      high: 'அதிக தேவை',
      moderate: 'மிதமான தேவை',
      steady: 'நிலையான தேவை',
    },
    common: {
      selectCrop: 'பயிரைத் தேர்ந்தெடுக்கவும்',
      selected: 'தேர்ந்தெடுக்கப்பட்டது',
      viewDetails: 'விவரங்களைப் பார்',
      compareMarkets: 'சந்தைகளை ஒப்பிடு',
      calculateProfit: 'லாபம் கணக்கிடு',
      save: 'சேமி',
      saved: 'சேமிக்கப்பட்டது',
      remove: 'நீக்கு',
      refresh: 'புதுப்பி',
      loading: 'ஏற்றுகிறது...',
      retry: 'மீண்டும் முயற்சி',
      perKg: '/ கிலோ',
      perQuintal: '/ குவிண்டால்',
      kg: 'கிலோ',
      quintal: 'குவிண்டால்',
      lastUpdated: 'கடைசி புதுப்பிப்பு',
      dataSource: 'ஆதாரம்',
      sampleDataTag: 'மாதிரி குறிப்புத் தரவு',
      liveAgmarknetTag: 'நேரடி AGMARKNET',
      liveWeatherTag: 'Open-Meteo நேரடி வானிலை',
      estimateTag: 'மதிப்பீடு',
      addFavorite: 'விருப்பத்தில் சேர்',
      removeFavorite: 'விருப்பத்தில் உள்ளது',
      all: 'அனைத்தும்',
      vegetables: 'காய்கறிகள்',
      otherCrops: 'பிற பயிர்கள்',
      close: 'மூடு',
    },
    dashboard: {
      heroHeadline: 'தெளிவான சந்தைத் தகவல்களுடன் அதிக லாபம் தரும் விற்பனை முடிவுகளை எடுங்கள்.',
      heroBody:
        'கீழே ஒரு பயிரைத் தேர்ந்தெடுத்து விலை, சந்தை ஒப்பீடு, போக்குவரத்துச் செலவுக்குப் பிந்தைய நிகர லாபம் அல்லது நேரடி வானிலையைப் பார்க்கவும்.',
      ctaCompare: 'சந்தை ஒப்பீடு',
      ctaProfit: 'லாபக் கணிப்பான்',
      quickCropTitle: 'பயிரைத் தேர்ந்தெடுக்கவும்',
      quickCropPrompt: 'நீங்கள் பயிரைத் தேர்ந்தெடுக்கும் வரை விரிவான தகவல்கள் மறைந்திருக்கும்.',
      previewReadyLabel: 'பயிர் சுருக்கம்',
      openFullCard: 'முழு பயிர் அட்டையைத் திற',
      servicesHeading: 'விவசாயி முடிவு கருவிகள்',
      servicesSubheading: 'தேவையான கருவியைத் தேர்ந்தெடுத்துப் பயன்படுத்துங்கள்.',
      serviceDescriptions: {
        cropInfo: 'தரம், தேவை, எதிர்பார்க்கப்படும் விலை மற்றும் 7-நாள் விலை போக்கைப் பாருங்கள்.',
        marketPrices: 'தமிழ்நாடு, கர்நாடகா, மகாராஷ்டிரா மற்றும் டெல்லி சந்தை விலைகள்.',
        marketComparison: 'கிலோ மற்றும் குவிண்டால் அடிப்படையில் அதிகபட்ச மற்றும் குறைந்தபட்ச விலை.',
        profitCalculator: 'போக்குவரத்து, ஏற்றுதல் மற்றும் உற்பத்திச் செலவுக்குப் பின் நிகர லாபம்.',
        weather: 'நேரடி வெப்பநிலை, மழை வாய்ப்பு, ஈரப்பதம், காற்று மற்றும் 5-நாள் முன்னறிவிப்பு.',
        voiceAssistant: 'தமிழ், ஆங்கிலம் அல்லது இந்தியில் குரல் மூலம் சந்தை கேள்விகளைக் கேளுங்கள்.',
      },
      activeAlertsBanner: 'உங்கள் இலக்கு விலையை எட்டிய சந்தை அறிவிப்புகள் உள்ளன.',
      viewAlerts: 'அறிவிப்புகளைப் பார்',
    },
    cropInfo: {
      title: 'பயிர் விவரங்கள்',
      subtitle: 'முழு 9-அம்ச சந்தை விவரங்களைக் காண கீழே ஒரு பயிரைத் தேர்ந்தெடுக்கவும்.',
      choosePrompt: 'விரிவான சந்தைத் தகவலைப் பார்க்க மேலே ஒரு பயிரைத் தேர்ந்தெடுக்கவும்.',
      fields: {
        cropName: 'பயிரின் பெயர்',
        cropQuality: 'பயிரின் தரம்',
        availableQuantity: 'கிடைக்கும் அளவு',
        currentMarketPrice: 'தற்போதைய சந்தை விலை',
        marketLocation: 'சந்தை இடம்',
        priceComparison: 'சந்தை விலை ஒப்பீடு',
        marketDemand: 'சந்தை தேவை',
        expectedSellingPrice: 'எதிர்பார்க்கப்படும் விற்பனை விலை',
        lastUpdatedPrice: 'கடைசியாகப் புதுப்பிக்கப்பட்ட விலை',
      },
      historyTitle: '7-நாள் குறிப்பு விலை போக்கு (₹/கிலோ)',
      storageTitle: 'சேமிப்பு மற்றும் கையாளுதல் ஆலோசனை',
      harvestSeasonLabel: 'அறுவடை பருவம்',
      shelfLifeLabel: 'பாதுகாப்பு காலம்',
      daysUnit: 'நாட்கள்',
    },
    marketPrices: {
      title: 'சந்தை விலைகள்',
      subtitle: 'வேளாண் சந்தைகளின் தற்போதைய மொத்த விற்பனை விலைகள்.',
      filterByState: 'மாநிலம் வாரியாக',
      filterByCrop: 'பயிர் வாரியாக',
      allStates: 'அனைத்து மாநிலங்கள்',
      allCrops: 'அனைத்துப் பயிர்கள்',
      tableHeaders: {
        crop: 'பயிர்',
        market: 'சந்தை பெயர்',
        location: 'இடம்',
        priceKg: 'விலை / கிலோ',
        priceQuintal: 'விலை / குவிண்டால்',
        demand: 'தேவை',
        updated: 'புதுப்பிப்பு',
        action: 'செயல்',
      },
      noMatches: 'தேர்ந்தெடுத்த வடிகட்டிக்குப் பொருந்தும் விலைகள் இல்லை.',
    },
    marketComparison: {
      title: 'சந்தை விலை ஒப்பீடு',
      subtitle: 'அதிக லாபம் தரும் சந்தையைக் கண்டறிய ஒரு பயிரின் விலைகளை ஒப்பிடுங்கள்.',
      chooseCropLabel: 'ஒப்பிட பயிரைத் தேர்ந்தெடுக்கவும்',
      highestMarket: 'அதிகபட்ச விலை சந்தை',
      lowestMarket: 'குறைந்தபட்ச விலை சந்தை',
      priceSpread: 'விலை வேறுபாடு',
      highestTag: 'அதிக விலை',
      lowestTag: 'குறைந்த விலை',
      useInCalculator: 'லாபக் கணிப்பானில் பயன்படுத்து',
      sortByPriceDesc: 'அதிகம் முதல் குறைவு',
      sortByPriceAsc: 'குறைவு முதல் அதிகம்',
    },
    profitCalc: {
      title: 'லாபக் கணிப்பான்',
      subtitle: 'உற்பத்தி, போக்குவரத்து, ஏற்றுதல் மற்றும் இதர செலவுகளுக்குப் பின் நிகர லாபத்தைக் கணக்கிடுங்கள்.',
      estimateDisclaimer:
        'கீழே காட்டப்படும் அனைத்து முடிவுகளும் நீங்கள் உள்ளிட்ட அளவு, செலவு மற்றும் சந்தை விலையின் அடிப்படையிலான மதிப்பீடுகள் மட்டுமே.',
      inputsTitle: 'அறுவடை மற்றும் செலவு விவரங்கள்',
      resultsTitle: 'மதிப்பிடப்பட்ட லாப விவரம்',
      cropLabel: 'தேர்ந்தெடுத்த பயிர்',
      quantityLabel: 'கிடைக்கும் அளவு',
      unitLabel: 'அலகு',
      sellingPriceLabel: 'எதிர்பார்க்கப்படும் விற்பனை விலை (₹ / கிலோ)',
      productionCostLabel: 'உற்பத்தி / கொள்முதல் செலவு (₹)',
      transportCostLabel: 'போக்குவரத்துச் செலவு (₹)',
      loadingCostLabel: 'ஏற்றுதல் மற்றும் இறக்குதல் செலவு (₹)',
      otherExpensesLabel: 'பிற செலவுகள் (சந்தை கட்டணம், பேக்கிங் ₹)',
      localMarketLabel: 'உள்ளூர் சந்தை (அடிப்படை)',
      destinationMarketLabel: 'விற்பனை சந்தை (இலக்கு)',
      autoFillRate: 'சந்தை விலையை நிரப்பு',
      resetForm: 'மீட்டமை',
      metrics: {
        totalRevenue: 'மதிப்பிடப்பட்ட மொத்த வருவாய்',
        totalExpenses: 'மதிப்பிடப்பட்ட மொத்த செலவு',
        netProfit: 'மதிப்பிடப்பட்ட நிகர லாபம்',
        profitPerKg: 'கிலோ ஒன்றுக்கு மதிப்பிடப்பட்ட லாபம்',
        totalTransport: 'மொத்த போக்குவரத்து & ஏற்றுதல்',
        profitMargin: 'மதிப்பிடப்பட்ட லாப சதவீதம்',
      },
      comparisonTitle: 'உள்ளூர் vs வெளியூர் சந்தை ஒப்பீடு (மதிப்பீடு)',
      localSellingLabel: 'உள்ளூர் சந்தை விற்பனை',
      destinationSellingLabel: 'தேர்ந்தெடுத்த சந்தை விற்பனை',
      verdictHigher: 'தேர்ந்தெடுத்த வெளியூர் சந்தை அதிக மதிப்பிடப்பட்ட நிகர லாபத்தைத் தருகிறது.',
      verdictLower: 'கூடுதல் போக்குவரத்துச் செலவால் உள்ளூர் சந்தை அதிக லாபகரமானதாக மதிப்பிடப்படுகிறது.',
      verdictEqual: 'இரண்டு சந்தைகளிலும் ஏறக்குறைய ஒரே அளவு நிகர லாபம் கிடைக்கும்.',
      validationError: 'சரியான நேர்மறை எண்களையும் 0-ஐ விட அதிக அளவையும் உள்ளிடவும்.',
    },
    weather: {
      title: 'வானிலை அறிக்கை',
      subtitle: 'Open-Meteo மூலம் நேரடி இட-அடிப்படையிலான வானிலை மற்றும் 5-நாள் முன்னறிவிப்பு.',
      locationInputPlaceholder: 'ஊர் அல்லது சந்தை நகரத்தை உள்ளிடவும் (எ.கா., கோயம்புத்தூர், சென்னை)...',
      checkWeatherBtn: 'வானிலை பார்',
      useSavedLocationBtn: 'சேமித்த இடம்',
      quickCitiesLabel: 'முக்கிய சந்தை நகரங்கள்:',
      currentTemp: 'தற்போதைய வெப்பநிலை',
      feelsLike: 'உணரும் வெப்பம்',
      condition: 'வானிலை நிலை',
      rainProbability: 'மழை வாய்ப்பு',
      humidity: 'ஈரப்பதம்',
      windSpeed: 'காற்றின் வேகம்',
      forecastTitle: '5-நாள் வானிலை முன்னறிவிப்பு',
      advisoryTitle: 'அறுவடை மற்றும் போக்குவரத்து வானிலைக் குறிப்பு',
      advisoryRain: 'மழை வாய்ப்பு அதிகம். அறுவடைப் பொருட்களைத் தார்பாய் கொண்டு பாதுகாப்பாகக் கொண்டு செல்லவும்.',
      advisoryHeat: 'வெயில் அதிகமாக உள்ளது. காலை நேரத்தில் அறுவடை செய்து நிழலில் வைக்கவும்.',
      advisoryClear: 'அறுவடை, உலர்த்தல் மற்றும் சந்தை போக்குவரத்திற்கு உகந்த வறண்ட வானிலை.',
      unavailableMessage: 'இந்த இடத்திற்கு நேரடி வானிலைத் தகவல் தற்போது கிடைக்கவில்லை.',
    },
    voice: {
      title: 'AI குரல் உதவியாளர்',
      subtitle: 'தமிழ், ஆங்கிலம் அல்லது இந்தியில் பேசி அல்லது தட்டச்சு செய்து சந்தை, லாபம் மற்றும் வானிலை விவரங்களைக் கேளுங்கள்.',
      honestyNote:
        'உங்கள் குரலைப் பெற உலாவி பேச்சு அங்கீகாரமும், துல்லியமான பதில்களுக்கு Gemini AI சேவையும் இணைக்கப்பட்டுள்ளது.',
      micStart: 'குரல் உள்ளீட்டைத் தொடங்கு',
      micStop: 'நிறுத்து',
      micListening: 'கேட்கிறது... தெளிவாகப் பேசுங்கள்',
      micUnsupported: 'இந்த உலாவியில் மைக்ரோஃபோன் ஆதரவு இல்லை. கீழே தட்டச்சு செய்யவும்.',
      speakToggle: 'பதிலை ஒலிக்கச் செய்',
      stopSpeaking: 'ஒலியை நிறுத்து',
      inputPlaceholder: 'தக்காளி விலை, வெங்காய லாபம் அல்லது வானிலை பற்றிக் கேளுங்கள்...',
      sendBtn: 'கேள்வி கேள்',
      sampleQuestionsTitle: 'மாதிரி கேள்விகள்:',
      sampleQuestions: [
        'இன்று தக்காளிக்கு எந்த சந்தையில் அதிக விலை உள்ளது?',
        'சென்னை மற்றும் நாசிக் வெங்காய விலைகளை ஒப்பிடுக.',
        'மழை வாய்ப்பு இருந்தால் போக்குவரத்தை எப்படித் திட்டமிடுவது?',
        'லாபக் கணிப்பானில் நிகர லாபம் எப்படி கணக்கிடப்படுகிறது?',
      ],
      welcomeMessage:
        'வணக்கம்! நான் உங்கள் ஸ்மார்ட் ஃபார்மர் உதவியாளர். பயிர் விலைகள், சிறந்த சந்தைகள், போக்குவரத்து லாபம் அல்லது வானிலை குறித்துக் கேளுங்கள்.',
    },
    products: {
      title: 'வேளாண் பொருட்கள் மற்றும் ரகங்கள்',
      subtitle: 'ஆதரிக்கப்படும் காய்கறிகள், தானியங்கள், பழங்கள் மற்றும் மசாலாப் பொருட்களின் தர விவரங்கள்.',
      varietyLabel: 'பொதுவான ரகம்',
      gradeLabel: 'தரம்',
      basePriceLabel: 'குறிப்பு விலை',
      shelfLifeLabel: 'பாதுகாப்பு காலம்',
    },
    favorites: {
      title: 'விருப்பங்கள், எச்சரிக்கைகள் & சமீபத்தியவை',
      subtitle: 'சேமித்த பயிர்கள், விருப்ப சந்தைகள், சமீபத்திய தேடல்கள் மற்றும் விலை அறிவிப்புகளை நிர்வகிக்கவும்.',
      favoriteCropsTitle: 'விருப்பமான பயிர்கள்',
      favoriteMarketsTitle: 'விருப்பமான சந்தைகள்',
      noFavoriteCrops: 'விருப்பமான பயிர்கள் இன்னும் சேமிக்கப்படவில்லை.',
      noFavoriteMarkets: 'விருப்பமான சந்தைகள் இன்னும் சேமிக்கப்படவில்லை.',
      alertsTitle: 'விலை உயர்வு அறிவிப்புகள் & விதிகள்',
      alertCropLabel: 'பயிர்',
      alertTargetLabel: 'இலக்கு விலை (₹ / கிலோ)',
      addAlertBtn: 'விலை எச்சரிக்கை சேர்',
      notificationsTitle: 'வந்த விலை அறிவிப்புகள்',
      noNotifications: 'தற்போது இலக்கு விலை எட்டிய அறிவிப்புகள் இல்லை.',
      markAllRead: 'அனைத்தையும் படித்ததாகக் குறி',
      recentSearchesTitle: 'சமீபத்திய தேடல்கள்',
      clearRecent: 'வரலாற்றை அழி',
      noRecentSearches: 'சமீபத்திய தேடல் வரலாறு காலியாக உள்ளது.',
    },
    profile: {
      title: 'விவசாயி சுயவிவரம், அமைப்புகள் & உதவி',
      subtitle: 'உங்கள் இயல்புநிலை ஊர், பண்ணை விவரங்கள் மற்றும் தரவு ஆதாரக் கொள்கையை நிர்வகிக்கவும்.',
      farmerDetailsTitle: 'விவசாயி சுயவிவரம் & இட அமைப்புகள்',
      nameLabel: 'விவசாயி பெயர்',
      locationLabel: 'இயல்புநிலை கிராமம் / நகரம்',
      stateLabel: 'மாநிலம்',
      farmSizeLabel: 'நில அளவு (ஏக்கர்)',
      notesLabel: 'விருப்ப சந்தை அல்லது பயிர் குறிப்புகள்',
      saveProfileBtn: 'சுயவிவரத்தைச் சேமி',
      profileSavedToast: 'சுயவிவரம் மற்றும் இயல்புநிலை இடம் சேமிக்கப்பட்டது.',
      helpTitle: 'உதவி & ஆதரவு',
      faqs: [
        {
          q: 'சந்தை விலைகள் நேரடித் தரவா அல்லது மாதிரித் தரவா?',
          a: 'ஒவ்வொரு அட்டவணையிலும் ஆதாரம் தெளிவாகக் காட்டப்படும். data.gov.in AGMARKNET சாவி அமைக்கப்பட்டால் நேரடி விலைகளும், இல்லையெனில் மாதிரி குறிப்புத் தரவும் காட்டப்படும்.',
        },
        {
          q: 'நிகர லாபம் எவ்வாறு கணக்கிடப்படுகிறது?',
          a: 'மொத்த வருவாய் (அளவு × விற்பனை விலை) கழித்தல் உற்பத்தி, போக்குவரத்து, ஏற்றுதல் மற்றும் பிற செலவுகள். இவை அனைத்தும் மதிப்பீடுகளே.',
        },
        {
          q: 'குரல் உதவியாளர் தமிழில் செயல்படுமா?',
          a: 'ஆம். தலைப்பில் தமிழ் மொழியைத் தேர்ந்தெடுத்துத் தமிழிலேயே பேசலாம் மற்றும் பதில்களைக் கேட்கலாம்.',
        },
      ],
      aboutTitle: 'ஸ்மார்ட் ஃபார்மர் பற்றி',
      aboutBody:
        'ஸ்மார்ட் ஃபார்மர் என்பது விவசாயிகள் சந்தை விலைகளை ஒப்பிட்டு, போக்குவரத்துச் செலவுகளைக் கணக்கிட்டு, வானிலையை அறிந்து அதிக லாபம் ஈட்ட உதவும் வேளாண் தகவல் தளமாகும்.',
      dataPolicyTitle: 'தரவு துல்லியம் மற்றும் ஆதாரம்',
      dataPolicyBody:
        'நேரடி வானிலை Open-Meteo மூலம் பெறப்படுகிறது. இந்திய சந்தை விலைகளுக்கு Open Government Data Platform India (AGMARKNET) ஆதரிக்கப்படுகிறது. மாதிரித் தரவுகள் விளக்கத்திற்காக மட்டுமே.',
    },
  },

  hi: {
    brandName: 'स्मार्ट फार्मर',
    brandSubtitle: 'कृषि बाज़ार और लाभ सहायता मंच',
    languageLabel: 'भाषा',
    searchPlaceholder: 'फसल, मंडी, स्थान या मांग खोजें...',
    clearSearch: 'साफ़ करें',
    recentSearches: 'हाल की खोजें',
    noSearchResults: 'कोई मेल खाने वाली फसल या मंडी नहीं मिली।',
    searchHint: 'पूरा विवरण देखने के लिए किसी परिणाम पर क्लिक करें।',
    nav: {
      dashboard: 'डैशबोर्ड',
      'crop-info': 'फसल जानकारी',
      'market-prices': 'मंडी भाव',
      'market-comparison': 'मंडी तुलना',
      'profit-calculator': 'लाभ कैलकुलेटर',
      weather: 'मौसम रिपोर्ट',
      'voice-assistant': 'AI वॉयस असिस्टेंट',
      products: 'उत्पाद',
      favorites: 'पसंदीदा',
      profile: 'प्रोफ़ाइल',
    },
    demand: {
      high: 'उच्च मांग',
      moderate: 'मध्यम मांग',
      steady: 'स्थिर मांग',
    },
    common: {
      selectCrop: 'फसल चुनें',
      selected: 'चयनित',
      viewDetails: 'विवरण देखें',
      compareMarkets: 'मंडियाँ तुलना करें',
      calculateProfit: 'लाभ अनुमान लगाएं',
      save: 'सहेजें',
      saved: 'सहेजा गया',
      remove: 'हटाएं',
      refresh: 'ताज़ा करें',
      loading: 'लोड हो रहा है...',
      retry: 'पुनः प्रयास करें',
      perKg: '/ किग्रा',
      perQuintal: '/ क्विंटल',
      kg: 'किग्रा',
      quintal: 'क्विंटल',
      lastUpdated: 'अंतिम अपडेट',
      dataSource: 'स्रोत',
      sampleDataTag: 'नमूना संदर्भ डेटा',
      liveAgmarknetTag: 'लाइव AGMARKNET',
      liveWeatherTag: 'Open-Meteo लाइव मौसम',
      estimateTag: 'अनुमान',
      addFavorite: 'पसंदीदा में सहेजें',
      removeFavorite: 'पसंदीदा में सहेजा गया',
      all: 'सभी',
      vegetables: 'सब्ज़ियाँ',
      otherCrops: 'अन्य फसलें',
      close: 'बंद करें',
    },
    dashboard: {
      heroHeadline: 'सटीक मंडी जानकारी के साथ अधिक लाभदायक बिक्री निर्णय लें।',
      heroBody:
        'नीचे किसी फसल को चुनें और भाव, मंडी तुलना, परिवहन खर्च के बाद शुद्ध लाभ या कटाई से पहले लाइव मौसम की जांच करें।',
      ctaCompare: 'मंडियाँ तुलना करें',
      ctaProfit: 'लाभ कैलकुलेटर',
      quickCropTitle: 'जांच के लिए फसल चुनें',
      quickCropPrompt: 'जब तक आप नीचे कोई फसल नहीं चुनते, विस्तृत जानकारी छिपी रहती है।',
      previewReadyLabel: 'फसल सारांश',
      openFullCard: 'पूरा फसल कार्ड खोलें',
      servicesHeading: 'किसान निर्णय उपकरण',
      servicesSubheading: 'आवश्यकतानुसार कोई भी टूल खोलें।',
      serviceDescriptions: {
        cropInfo: 'गुणवत्ता ग्रेड, मांग, संभावित बिक्री मूल्य और 7-दिन का भाव रुझान देखें।',
        marketPrices: 'तमिलनाडु, कर्नाटक, महाराष्ट्र और दिल्ली की मंडियों के भाव देखें।',
        marketComparison: 'प्रति किग्रा और प्रति क्विंटल सबसे ऊंचे व सबसे कम मंडी भाव पहचानें।',
        profitCalculator: 'परिवहन, लदाई और उत्पादन लागत के बाद शुद्ध लाभ की गणना करें।',
        weather: 'लाइव तापमान, बारिश की संभावना, नमी, हवा और 5-दिन का पूर्वानुमान।',
        voiceAssistant: 'अंग्रेजी, तमिल या हिंदी में बोलकर या लिखकर कृषि सवाल पूछें।',
      },
      activeAlertsBanner: 'वर्तमान मंडी भावों में आपके लक्ष्य मूल्य अलर्ट मेल खाए हैं।',
      viewAlerts: 'सूचनाएं देखें',
    },
    cropInfo: {
      title: 'फसल जानकारी',
      subtitle: 'पूरी 9-बिंदु बाज़ार प्रोफ़ाइल देखने के लिए नीचे एक फसल चुनें।',
      choosePrompt: 'विस्तृत जानकारी देखने के लिए ऊपर से कोई फसल कार्ड चुनें।',
      fields: {
        cropName: 'फसल का नाम',
        cropQuality: 'फसल गुणवत्ता',
        availableQuantity: 'उपलब्ध मात्रा',
        currentMarketPrice: 'वर्तमान मंडी भाव',
        marketLocation: 'मंडी स्थान',
        priceComparison: 'मंडी भाव तुलना',
        marketDemand: 'बाज़ार मांग',
        expectedSellingPrice: 'अपेक्षित बिक्री मूल्य',
        lastUpdatedPrice: 'अंतिम अपडेटेड भाव',
      },
      historyTitle: '7-दिन का संदर्भ मूल्य रुझान (₹/किग्रा)',
      storageTitle: 'भंडारण और देखभाल सलाह',
      harvestSeasonLabel: 'कटाई का समय',
      shelfLifeLabel: 'भंडारण अवधि',
      daysUnit: 'दिन',
    },
    marketPrices: {
      title: 'मंडी भाव',
      subtitle: 'प्रमुख कृषि मंडियों में वर्तमान थोक भाव।',
      filterByState: 'राज्य के अनुसार फ़िल्टर',
      filterByCrop: 'फसल के अनुसार फ़िल्टर',
      allStates: 'सभी राज्य',
      allCrops: 'सभी फसलें',
      tableHeaders: {
        crop: 'फसल',
        market: 'मंडी का नाम',
        location: 'स्थान',
        priceKg: 'भाव / किग्रा',
        priceQuintal: 'भाव / क्विंटल',
        demand: 'मांग',
        updated: 'अंतिम अपडेट',
        action: 'कार्रवाई',
      },
      noMatches: 'चयनित फ़िल्टर से कोई मंडी भाव मेल नहीं खाता।',
    },
    marketComparison: {
      title: 'मंडी भाव तुलना',
      subtitle: 'अधिक लाभदायक मंडी पहचानने के लिए एक फसल के विभिन्न मंडी भावों की तुलना करें।',
      chooseCropLabel: 'तुलना के लिए फसल चुनें',
      highestMarket: 'सबसे अधिक भाव वाली मंडी',
      lowestMarket: 'सबसे कम भाव वाली मंडी',
      priceSpread: 'मूल्य अंतर',
      highestTag: 'सबसे ऊंचा भाव',
      lowestTag: 'सबसे कम भाव',
      useInCalculator: 'लाभ कैलकुलेटर में उपयोग करें',
      sortByPriceDesc: 'अधिक से कम',
      sortByPriceAsc: 'कम से अधिक',
    },
    profitCalc: {
      title: 'लाभ कैलकुलेटर',
      subtitle: 'उत्पादन, परिवहन, लदाई-उतराई और अन्य खर्चों के बाद शुद्ध लाभ का अनुमान लगाएं।',
      estimateDisclaimer:
        'नीचे दिखाए गए सभी परिणाम आपकी दर्ज मात्रा, लागत और चयनित मंडी भाव के आधार पर वित्तीय अनुमान हैं।',
      inputsTitle: 'फसल और खर्च विवरण',
      resultsTitle: 'अनुमानित लाभ विवरण',
      cropLabel: 'चयनित फसल',
      quantityLabel: 'उपलब्ध मात्रा',
      unitLabel: 'इकाई',
      sellingPriceLabel: 'अपेक्षित बिक्री भाव (₹ / किग्रा)',
      productionCostLabel: 'उत्पादन / खरीद लागत (कुल ₹)',
      transportCostLabel: 'परिवहन लागत (कुल ₹)',
      loadingCostLabel: 'लदाई व उतराई खर्च (कुल ₹)',
      otherExpensesLabel: 'अन्य खर्च (मंडी शुल्क, पैकिंग ₹)',
      localMarketLabel: 'स्थानीय मंडी (आधार)',
      destinationMarketLabel: 'गंतव्य मंडी',
      autoFillRate: 'मंडी भाव भरें',
      resetForm: 'रीसेट करें',
      metrics: {
        totalRevenue: 'अनुमानित कुल आय',
        totalExpenses: 'अनुमानित कुल खर्च',
        netProfit: 'अनुमानित शुद्ध लाभ',
        profitPerKg: 'प्रति किग्रा अनुमानित लाभ',
        totalTransport: 'कुल परिवहन व लदाई खर्च',
        profitMargin: 'अनुमानित लाभ प्रतिशत',
      },
      comparisonTitle: 'स्थानीय बनाम गंतव्य मंडी तुलना (अनुमान)',
      localSellingLabel: 'स्थानीय मंडी में बिक्री',
      destinationSellingLabel: 'चयनित मंडी में बिक्री',
      verdictHigher: 'चयनित गंतव्य मंडी में अधिक अनुमानित शुद्ध लाभ मिलने की संभावना है।',
      verdictLower: 'अतिरिक्त परिवहन खर्च के कारण स्थानीय मंडी में बेचना अधिक लाभदायक अनुमानित है।',
      verdictEqual: 'दोनों मंडियों में लगभग समान अनुमानित शुद्ध लाभ मिलता है।',
      validationError: 'कृपया सही गैर-ऋणात्मक संख्याएं और 0 से अधिक मात्रा दर्ज करें।',
    },
    weather: {
      title: 'मौसम रिपोर्ट',
      subtitle: 'Open-Meteo द्वारा संचालित लाइव स्थान-आधारित मौसम और 5-दिन का पूर्वानुमान।',
      locationInputPlaceholder: 'गांव, कस्बा या मंडी शहर दर्ज करें (जैसे, नासिक, इंदौर)...',
      checkWeatherBtn: 'मौसम देखें',
      useSavedLocationBtn: 'सहेजा गया स्थान',
      quickCitiesLabel: 'प्रमुख मंडी शहर:',
      currentTemp: 'वर्तमान तापमान',
      feelsLike: 'महसूस तापमान',
      condition: 'मौसम स्थिति',
      rainProbability: 'बारिश की संभावना',
      humidity: 'नमी',
      windSpeed: 'हवा की गति',
      forecastTitle: '5-दिन का मौसम पूर्वानुमान',
      advisoryTitle: 'कटाई व परिवहन मौसम सलाह',
      advisoryRain: 'बारिश की संभावना अधिक है। लदाई और परिवहन में तिरपाल से फसल को ढककर रखें।',
      advisoryHeat: 'गर्म मौसम की संभावना है। नाज़ुक सब्ज़ियों की कटाई सुबह जल्दी करें और छाया में रखें।',
      advisoryClear: 'कटाई, सुखाने और मंडी परिवहन के लिए अनुकूल साफ मौसम।',
      unavailableMessage: 'इस स्थान के लिए लाइव मौसम जानकारी अभी उपलब्ध नहीं है।',
    },
    voice: {
      title: 'AI वॉयस असिस्टेंट',
      subtitle: 'फसल भाव, मंडी, लाभ या मौसम पूछने के लिए हिंदी, तमिल या अंग्रेजी में बोलें या टाइप करें।',
      honestyNote:
        'आवाज़ पहचान के लिए ब्राउज़र स्पीच इनपुट और सटीक उत्तरों के लिए सर्वर-साइड Gemini AI का उपयोग किया गया है।',
      micStart: 'बोलना शुरू करें',
      micStop: 'सुनना बंद करें',
      micListening: 'सुन रहा हूँ... कृपया स्पष्ट बोलें',
      micUnsupported: 'इस ब्राउज़र में माइक्रोफ़ोन उपलब्ध नहीं है। कृपया नीचे टाइप करें।',
      speakToggle: 'उत्तर बोलकर सुनाएं',
      stopSpeaking: 'आवाज़ रोकें',
      inputPlaceholder: 'टमाटर भाव, प्याज लाभ या मौसम के बारे में पूछें...',
      sendBtn: 'पूछें',
      sampleQuestionsTitle: 'पूछकर देखें:',
      sampleQuestions: [
        'आज टमाटर का सबसे ऊंचा भाव किस मंडी में है?',
        'नासिक और दिल्ली में प्याज के भाव की तुलना करें।',
        'कल बारिश होने पर परिवहन की योजना कैसे बनाएं?',
        'कैलकुलेटर में शुद्ध लाभ कैसे निकाला जाता है?',
      ],
      welcomeMessage:
        'नमस्ते! मैं आपका स्मार्ट फार्मर सहायक हूँ। आप फसल भाव, मंडी तुलना, परिवहन लाभ या मौसम के बारे में पूछ सकते हैं।',
    },
    products: {
      title: 'कृषि उत्पाद और किस्में',
      subtitle: 'समर्थित सब्ज़ियों, अनाजों, फलों और मसालों के ग्रेडिंग मानक देखें।',
      varietyLabel: 'सामान्य किस्म',
      gradeLabel: 'गुणवत्ता ग्रेड',
      basePriceLabel: 'संदर्भ भाव',
      shelfLifeLabel: 'भंडारण अवधि',
    },
    favorites: {
      title: 'पसंदीदा, अलर्ट और हाल की गतिविधि',
      subtitle: 'सहेजी गई फसलें, पसंदीदा मंडियाँ, हाल की खोजें और लक्ष्य मूल्य सूचनाएं प्रबंधित करें।',
      favoriteCropsTitle: 'पसंदीदा फसलें',
      favoriteMarketsTitle: 'पसंदीदा मंडियाँ',
      noFavoriteCrops: 'अभी कोई पसंदीदा फसल नहीं है। फसल जानकारी से फसलें सहेजें।',
      noFavoriteMarkets: 'अभी कोई पसंदीदा मंडी नहीं है। मंडी तुलना से मंडियाँ बुकमार्क करें।',
      alertsTitle: 'मूल्य अपडेट सूचनाएं और अलर्ट',
      alertCropLabel: 'फसल',
      alertTargetLabel: 'लक्ष्य भाव (₹ / किग्रा)',
      addAlertBtn: 'मूल्य अलर्ट जोड़ें',
      notificationsTitle: 'सक्रिय मूल्य सूचनाएं',
      noNotifications: 'अभी कोई लक्ष्य मूल्य पूरा नहीं हुआ है।',
      markAllRead: 'सभी पढ़ा हुआ चिह्नित करें',
      recentSearchesTitle: 'हाल की खोजें',
      clearRecent: 'इतिहास साफ़ करें',
      noRecentSearches: 'आपका हाल का खोज इतिहास खाली है।',
    },
    profile: {
      title: 'किसान प्रोफ़ाइल, सेटिंग्स और सहायता',
      subtitle: 'अपना डिफ़ॉल्ट स्थान सेट करें, खेत का विवरण सहेजें और डेटा पारदर्शिता नीति देखें।',
      farmerDetailsTitle: 'किसान प्रोफ़ाइल और स्थान सेटिंग्स',
      nameLabel: 'किसान का नाम',
      locationLabel: 'डिफ़ॉल्ट गांव / शहर',
      stateLabel: 'राज्य',
      farmSizeLabel: 'खेत का आकार (एकड़)',
      notesLabel: 'पसंदीदा मंडियाँ या फसल नोट्स',
      saveProfileBtn: 'प्रोफ़ाइल सहेजें',
      profileSavedToast: 'प्रोफ़ाइल और डिफ़ॉल्ट स्थान सहेजा गया।',
      helpTitle: 'सहायता और समर्थन',
      faqs: [
        {
          q: 'क्या मंडी भाव लाइव हैं या नमूना डेटा है?',
          a: 'हर तालिका में स्रोत स्पष्ट दिखाया जाता है। सर्वर पर data.gov.in AGMARKNET कुंजी सेट होने पर लाइव भाव आते हैं, अन्यथा स्पष्ट रूप से लेबल किया गया नमूना संदर्भ डेटा दिखाया जाता है।',
        },
        {
          q: 'शुद्ध लाभ की गणना कैसे होती है?',
          a: 'शुद्ध लाभ = कुल आय (मात्रा × बिक्री भाव) घटा उत्पादन लागत, परिवहन खर्च, लदाई-उतराई और अन्य खर्च। सभी परिणाम अनुमान हैं।',
        },
        {
          q: 'क्या AI वॉयस असिस्टेंट हिंदी और तमिल में काम करता है?',
          a: 'हाँ। ऊपर भाषा बदलकर आप हिंदी, तमिल या अंग्रेजी में बोलकर और लिखकर उत्तर प्राप्त कर सकते हैं।',
        },
      ],
      aboutTitle: 'स्मार्ट फार्मर के बारे में',
      aboutBody:
        'स्मार्ट फार्मर एक कृषि बाज़ार बुद्धिमत्ता मंच है जो किसानों को मंडी भाव तुलना, परिवहन खर्च विश्लेषण और लाइव मौसम देखकर बेहतर आय अर्जित करने में मदद करता है।',
      dataPolicyTitle: 'डेटा सटीकता और स्रोत',
      dataPolicyBody:
        'लाइव मौसम Open-Meteo से प्राप्त होता है। भारतीय मंडी भावों के लिए Open Government Data Platform India (AGMARKNET) का समर्थन है। नमूना भाव केवल उदाहरण के लिए हैं।',
    },
  },
};
