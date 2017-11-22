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
    permissions: string;
    user_group_golf: string;
    user_group_hoa: string;
    account_setup: boolean;

    // Calculated
    full_name: string;

    constructor(init: any) {
        this.id = init.id;
        this.email = init.email;
        this.first_name = init.first_name;
        this.last_name = init.last_name;
        this.receive_emails = init.receive_emails;
        this.contact_number = init.contact_number;
        this.account_setup = init.account_setup || false;
        this.image_url = init.image_url;
        this.addressL1 = init.addressL1;
        this.addressL2 = init.addressL2;
        this.city = init.city;
        this.province = init.province;
        this.postal_code = init.postal_code;
        this.country = init.country;
        this.permissions = init.permissions;
        this.user_group_golf = init.user_group_golf;
        this.user_group_hoa = init.user_group_hoa;

        this.full_name = this.first_name + " " + this.last_name;
    }
}
