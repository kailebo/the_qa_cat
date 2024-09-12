import {type Locator, type Page } from '@playwright/test';

//Simple POM to start orginizing common test action from Home Page
export class HomePage {
    readonly page: Page;
    readonly accountButton: Locator;
        
    constructor(page: Page) {
        this.page = page;
        this.accountButton = page.locator('a[href*="account"]:visible');
    }
    async gotoDev() {
        //Navigate to The QA Cat account page
        await this.page.goto('https://the-qa-cat-cafe.myshopify.com/');
        //login to site (since it is a development site)
        await this.page.locator('#password').fill('awtsee');
        await this.page.getByRole('button').click();
    }
    async gotoAccountPage() {
        await this.accountButton.click();
    }
}