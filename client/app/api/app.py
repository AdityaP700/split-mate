from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

driver = webdriver.Chrome()
driver.get("https://www.linkedin.com/login")
time.sleep(2)

email = driver.find_element(By.ID, "username")
password = driver.find_element(By.ID, "password")

email.send_keys("your_email@example.com")
password.send_keys("your_password")

login_button = driver.find_element(By.XPATH, '//button[@type="submit"]')
login_button.click()

message = driver.find_element("msg-overlay-bubble-header__badge-container")
message.click()

searchBox = driver.find_element("msg-overlay-list-bubble-search__search-typeahead-input")
searchBox.send_keys("User's name")
searchBox.send_keys(Keys.RETURN)
time.sleep(5)
driver.find_element("search-result__result-link").click()

messageBox = driver.find_element("msg-form__contenteditabl")
messageBox.send_keys("Your Message Here")
messageBox.send_keys(Keys.RETURN)

time.sleep(10)
driver.quit()
print(driver.title)