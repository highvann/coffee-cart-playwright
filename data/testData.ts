export interface CoffeeDrink {
    id: string;
    name: string;
    dataTestSlug: string;
    price: number;
    chineseName: string;
}

export interface CustomerProfile {
    name: string;
    email: string;
    subscribePromo?: boolean;
}

export const DRINKS: Record<string, CoffeeDrink> = {
    espresso: {
        id: 'espresso',
        name: 'Espresso',
        dataTestSlug: 'Espresso',
        price: 10,
        chineseName: '特浓咖啡',
    },
    espressoMacchiato: {
        id: 'espressoMacchiato',
        name: 'Espresso Macchiato',
        dataTestSlug: 'Espresso_Macchiato',
        price: 12,
        chineseName: '浓缩玛奇朵',
    },
    cappuccino: {
        id: 'cappuccino',
        name: 'Cappuccino',
        dataTestSlug: 'Cappuccino',
        price: 19,
        chineseName: '卡布奇诺',
    },
    mocha: {
        id: 'mocha',
        name: 'Mocha',
        dataTestSlug: 'Mocha',
        price: 8,
        chineseName: '摩卡',
    },
    flatWhite: {
        id: 'flatWhite',
        name: 'Flat White',
        dataTestSlug: 'Flat_White',
        price: 18,
        chineseName: '平白咖啡',
    },
    americano: {
        id: 'americano',
        name: 'Americano',
        dataTestSlug: 'Americano',
        price: 7,
        chineseName: '美式咖啡',
    },
    cafeLatte: {
        id: 'cafeLatte',
        name: 'Cafe Latte',
        dataTestSlug: 'Cafe_Latte',
        price: 16,
        chineseName: '拿铁',
    },
    espressoConPanna: {
        id: 'espressoConPanna',
        name: 'Espresso Con Panna',
        dataTestSlug: 'Espresso_Con Panna',
        price: 14,
        chineseName: '浓缩康宝蓝',
    },
    cafeBreve: {
        id: 'cafeBreve',
        name: 'Cafe Breve',
        dataTestSlug: 'Cafe_Breve',
        price: 15,
        chineseName: '半拿铁',
    },
};

export const CUSTOMER_PROFILES: Record<string, CustomerProfile> = {
    valid: {
        name: 'Alex Morgan',
        email: 'alex.morgan@example.com',
        subscribePromo: true,
    },
    validAlternative: {
        name: 'Nico James',
        email: 'nico.james@example.com',
        subscribePromo: false,
    },
    invalidEmail: {
        name: 'Test User',
        email: 'invalid-email-format',
        subscribePromo: false,
    },
};

export const UI_MESSAGES = {
    emptyCart: 'No coffee, go add some.',
    checkoutSuccess: 'Thanks for your purchase. Please check your email for payment.',
    promoHeaderSnippet: "It's your lucky day!",
};
