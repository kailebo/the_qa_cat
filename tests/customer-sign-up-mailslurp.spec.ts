import { test,expect } from '@playwright/test';
import { MailSlurp } from 'mailslurp-client';
import { HomePage } from '../POM/HomePage';


test('create an account with real email', async ({ page }) => {
    //Access my mailslup account
    const mailslurp = new MailSlurp({ apiKey: "a15788e6ecc543ba4227ebffe5e3fd34fc2b0f38f49a3638e5042970f73302ef" });
    //Use Mailslurp to create an email
    const newCustomerInbox = await mailslurp.inboxController.createInboxWithDefaults();    

    //Navigate to The QA Cat account page with POM
    const newDevPage = new HomePage(page);
    await newDevPage.gotoDev();
    await newDevPage.gotoAccountPage();
    
    //Enter the new email address, click continue
    await page.locator('#account_email').fill(newCustomerInbox.emailAddress)
    await page.locator('button[type="submit"]').click();

    //Wait for six digit authorization code box to be visible
    const authCodeInput = page.locator('#account_auth_code')
    await authCodeInput.waitFor({ state: "visible" });
    
    //Check email imbox for auth code email
    // - Waits for email with 6 digit code for up to 120_000 miliseconds
    // - unreadOnly should be true since it is a new email it will come in unread
    const sixDigitCodeEmail = await mailslurp.waitController.waitForLatestEmail({
        inboxId: newCustomerInbox.id, 
        timeout: 120000, 
        unreadOnly:true
    }).catch(error => {
        throw new Error("email with 6-digit authorization code was not received before timeout period")
    });
    
    //Read 6 digit code from email
    expect(sixDigitCodeEmail.body).toContain('Your 6-digit code is');
    const codePattern = '([0-9]{6})' //Expect a code with numbers btwn 0-9 and 6 digits long
    const authCode = await mailslurp.emailController.getEmailContentMatch({
        contentMatchOptions: { pattern: codePattern },
        emailId: sixDigitCodeEmail.id
    })
    
    // **This is were my code is struggling:
    //Enter 6 digit code on The QA Cat and click continue   
    await authCodeInput.fill(authCode.matches[0]);
    await page.locator('button[type="submit"]').click();

    //Expect logout button, or success message etc.
    await page.locator('button[aria-label="Show Account menu"]').click();
    
    await expect(page.locator('span[toHaveText="Log out"]'))
})
