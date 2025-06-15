export class userRegisration {
    name: string = '';
    email: string = '';
    phoneNumber: string = '';
    password: string = '';
}
export class OtpVerification {
    email: string = '';
    otp: string = '';
}
export class products {
    id: string = '';
    name: string = '';
    description: string = '';
    price: number = 0;
    imageUrl: string = '';
    stockQuantity: number = 0;
}

export class order {
    id: number = 0;
    orderDate: Date = new Date();
    totalPrice: number = 0;
    items: { id: number, product: products, quantity: number }[] = [];
    price: number = 0;
    status: string = '';
}

export class address {
    AddL1: string = '';
    AddL2: string = '';
    city: string = '';
    state: string = '';
    zip: number |null = null;
    country: string = '';
}