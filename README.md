# Product Carousel

## Overview

This project implements a responsive product carousel on the product pages of the [LC Waikiki](https://www.lcwaikiki.com) website. The carousel displays a selection of products that users might be interested in, allowing them to smoothly scroll through the products. Users can interact with the carousel by clicking on product items, favoriting them with a heart icon, and viewing product details in a new tab. The carousel also ensures a smooth user experience by storing user preferences in the local storage, allowing favorited products to persist even after a page refresh.

## Features

- **Product Carousel**: 
  - Displays six and a half products with the ability to slide right or left by clicking on arrow buttons.
  - Smooth sliding effect when navigating between products.
  - Displays the title "You Might Also Like" at the top of the carousel.
  
- **Product Click Interaction**:
  - Clicking on a product opens the respective product page in a new tab.
  
- **Heart Icon Favorite System**:
  - Clicking on the heart icon fills it with blue, indicating the product has been favorited.
  - Favorite status is stored in local storage, so even after a page refresh, the favorite products and heart icon state persist.

- **Local Storage**:
  - Upon running the code for the second time after refreshing the page, it should retrieve the product list from the local storage instead of making another fetch request. Additionally, the code should ensure that the favorited products with filled hearts are displayed.
  
- **Responsiveness**: 
  - The design is fully responsive and adapts to different screen sizes, including mobile, tablet, and desktop views.
  
- **Dynamic Fetch**: 
  - The product list is fetched from an external JSON endpoint during the first load.
  - After the first load, data is retrieved from local storage to avoid unnecessary network requests.

## Technologies Used

- **JavaScript**: All logic is implemented in vanilla JavaScript.
- **HTML and CSS**: HTML and CSS structures are dynamically created and applied using JavaScript.

## Getting Started

1. Open the Chrome Developer Tools console on the product page of the [LC Waikiki](https://www.lcwaikiki.com) website.
2. Copy the content of the `product-carousel.js` file.
3. Paste it into the console and run the script.
4. The carousel should appear below the element with the class `.product-detail`.

## Code Explanation

1. **Fetching the Product Data**: 
   - The product data is initially fetched from the provided JSON URL using a GET request. 
   - If the data is available in local storage (after the first load), it will be used instead of making another request.

2. **Building the Carousel**:
   - The carousel structure (including product images, titles, and heart icons) is dynamically created with JavaScript.
   - CSS is used to style the carousel, making it visually appealing and responsive.

3. **Carousel Interaction**:
   - The user can click the left and right arrow buttons to smoothly scroll through the products.
   - Clicking on a product opens its details page in a new tab.
   - Clicking on the heart icon toggles the "favorited" state and stores this preference in the local storage.

4. **Responsiveness**:
   - The number of products visible at a time adjusts based on the screen size. On larger screens, more products are visible, while on smaller screens (mobile and tablet), fewer products are shown.

## Requirements

- **JavaScript **: Only vanilla JavaScript is used in this project. No external libraries like Swiper or Bootstrap are used.
- **Single JavaScript File**: The entire functionality is encapsulated in a single `.js` file that can be executed in the Chrome Developer Tools console.

## How to Test

- Open the product page on the [LC Waikiki website](https://www.lcwaikiki.com).
- Run the script in the browser's console.
- The carousel should appear and work as expected:
  - Clicking arrows should move the carousel items smoothly.
  - Clicking on a product should open its page in a new tab.
  - The heart icon should toggle between filled and empty when clicked.
  - Upon refresh, the favorite products should persist, and the data should be fetched from local storage.
