//Import playwright test and expect
import {test,expect} from '@playwright/test'

//Home page POM (Page Object Model)
class AccountPage {
    constructor(private page) {}

    async loginAsCustomer(email: string, password: string) {
        await this.page.locator()
    }
}

test('has login button', async ({ page }) => {
    //Open browser
    await page.goto('https://the-qa-cat-cafe.myshopify.com/');
    //login to site (since it is a development site)
    await page.locator('#password').fill('awtsee');
    await page.getByRole('button').click();

    //Expect the account button
    let accountButton = page.locator('a[href*="account"]');
    await expect(accountButton).toBeVisible();
})

test('login as existing customer with valid credentials', async ({ page }) => {
    //open browser
    await page.goto('https://the-qa-cat-cafe.myshopify.com/');
    //login to site (since it is a development site)
    await page.locator('#password').fill('awtsee');
    await page.getByRole('button').click();

    //Click on account icon
    await page.locator('a[href*="account"]:visible').click();
    
    //Check for email box
    let emailInput = page.locator('#account_email')
    await expect(emailInput).toBeVisible()
    await emailInput.fill('polydactylcatlady@example.com') 
})