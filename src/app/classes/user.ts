export class User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    receive_emails: boolean;
    contact_number: string;
    image_url: string;
    addressL1: string;
    addressL2: string;
    city: string;
    province: string;
    postal_code: string;
    country: string;
    addressL1_alt: string;
    addressL2_alt: string;
    city_alt: string;
    province_alt: string;
    postal_code_alt: string;
    country_alt: string;
    permissions: string;
    user_group_golf: string;
    user_group_hoa: string;
    account_setup: boolean;

    // Calculated
    full_name: string;

    constructor(init: any) {
        for (const key of Object.keys(init)) {
            this[key] = init[key];
        }

        this.full_name = this.first_name + ' ' + this.last_name;
    }
}
