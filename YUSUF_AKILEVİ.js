/**
 * ICONS Object
 * Stores SVG icons as string templates for easy reuse throughout the application.
 */
const ICONS = {
  arrow:
    '<svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg>',
  heart:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20.576" height="19.483" viewBox="0 0 20.576 19.483"><path fill="none" stroke="#555" stroke-width="1.5px" d="M19.032 7.111c-.278-3.063-2.446-5.285-5.159-5.285a5.128 5.128 0 0 0-4.394 2.532 4.942 4.942 0 0 0-4.288-2.532C2.478 1.826.31 4.048.032 7.111a5.449 5.449 0 0 0 .162 2.008 8.614 8.614 0 0 0 2.639 4.4l6.642 6.031 6.755-6.027a8.615 8.615 0 0 0 2.639-4.4 5.461 5.461 0 0 0 .163-2.012z" transform="translate(.756 -1.076)"></path></svg>',
};

/**
 * CONFIG Object
 * Contains configuration values used throughout the carousel.
 * - `productWidth`: The width of a single product card.
 * - `mobileBreakpoint`: Screen width (in pixels) at which mobile-specific behavior is applied.
 */
const CONFIG = {
  productWidth: 220.05,
  mobileBreakpoint: 960,
};

/**
 * CarouselComponent Class
 * Represents the carousel component for displaying products.
 * - Handles HTML generation, event listeners, dynamic product rendering, and user interactions.
 */
class CarouselComponent {
  products;
  currentProduct = 0; // Tracks the current product index
  lastProduct; // Index of the last product
  fullyShownProductNumber; // Number of fully visible products based on screen width
  partialProductPercentage; // Percentage of the partially visible product
  translateAmount; // Translation amount
  windowWidth;

  /**
   * Constructor
   * Initializes the carousel with product data.
   * @param {Array} productsData - Array of product objects to display in the carousel.
   */
  constructor(productsData) {
    this.products = productsData;
    this.lastProduct = this.products.length - 1;
  }

  /**
   * Initializes the carousel component.
   * Sets up HTML structure, styles, and event listeners.
   */
  init() {
    this.createHtmlStructure();
    this.applyStyles();
    this.setupEventListeners();
    this.calculateVisibleProducts();
  }

  /**
   * Creates the HTML structure for the carousel component and appends it to the DOM.
   * - Builds the container, title, product items, and navigation arrows.
   * - Inserts the carousel into the DOM right after the `.product-detail` element.
   */
  createHtmlStructure() {
    const carouselContainer = this.createElement("div", "carousel-container");
    const carouselComponent = this.createElement("div", "carousel-component");

    // Create and set up the title for the carousel
    const title = this.createElement("p", "carousel-component-title");
    title.textContent = "You might also like";

    // Generate product markup for all products and add it to the carousel component
    carouselComponent.innerHTML = this.products.map(this.generateProductMarkup).join("");

    // Append the title, left arrow, product items, and right arrow to the main container
    carouselContainer.appendChild(title);
    carouselContainer.appendChild(this.createArrowButton("left"));
    carouselContainer.appendChild(carouselComponent);
    carouselContainer.appendChild(this.createArrowButton("right"));

    document.querySelector(".product-detail").after(carouselContainer);
  }

  /**
   * Creates a new HTML element with the specified tag name and class name.
   * @param {string} tagName - The tag name of the element to create.
   * @param {string} [className] - The class name to add to the element.
   * @returns {HTMLElement} The created HTML element.
   */
  createElement(tagName, className) {
    const element = document.createElement(tagName);
    if (className) {
      element.classList.add(className);
    }
    return element;
  }

  /**
   * Creates an arrow button for navigation.
   * @param {string} direction - The direction of the arrow button (`left` or `right`).
   * @returns {HTMLElement} The created arrow button element.
   */
  createArrowButton(direction) {
    const button = this.createElement("button", `${direction}-arrow-icon`);
    button.innerHTML = ICONS.arrow;
    return button;
  }

  /**
   * Generates the HTML markup for a single product card.
   * @param {Object} product - The product object containing details like id, name, url, img, price, and isFav.
   * @returns {string} The HTML string for the product card.
   */
  generateProductMarkup(product) {
    return `
    <div class="product" id="${product.id}">
        <div class="product-inner">
            <a href="${product.url}" target="_blank">
            <div class="product-img-container">
                <img src="${product.img}" alt="${product.name}" class="product-img" />
                <button class="add-to-favorite-button ${product.isFav ? "favorite" : ""}">${ICONS.heart}</button>
            </div>
            <div class="product-text">
                <p class="product-name">${product.name}</p>
                <p class="product-price">${product.price} TL</p>
            </div>
            </a>  
        </div>
    </div>
    `;
  }

  /**
   * Sets up event listeners for navigation buttons, window resize, and favorite buttons.
   */
  setupEventListeners() {
    document.querySelector(".right-arrow-icon").addEventListener("click", this.nextProduct.bind(this));
    document.querySelector(".left-arrow-icon").addEventListener("click", this.prevProduct.bind(this));
    window.addEventListener("resize", this.calculateVisibleProducts.bind(this));
    this.setupFavoriteButtons();
  }

  /**
   * Adds click event listeners to all "Add to Favorite" buttons.
   */
  setupFavoriteButtons() {
    document.querySelectorAll(".add-to-favorite-button").forEach((button, index) => {
      button.addEventListener("click", (e) => this.handleFavoriteClick(e, index));
    });
  }

  /**
   * Toggles the favorite status of a product and updates the UI.
   * @param {Event} event - The click event.
   * @param {number} index - The index of the product in the `products` array.
   */
  handleFavoriteClick(event, index) {
    event.preventDefault();
    this.products[index].isFav = !this.products[index].isFav;
    event.currentTarget.classList.toggle("favorite");
    this.saveToLocalStorage();
  }

  /**
   * Saves the product data (including favorite status) to local storage.
   */
  saveToLocalStorage() {
    localStorage.setItem("productData", JSON.stringify(this.products));
  }

  /**
   * Moves the carousel products one by one according to chosen direction.
   * - Calculates the translation for each product based on the given index.
   * - Applies the `transform: translateX` style to shift the carousel accordingly.
   *
   * @param {number} productIndex - The index of the product to display.
   */
  goToProduct(productIndex) {
    // Select all product elements in the carousel
    const products = document.querySelectorAll(".product");

    // Apply a horizontal translation to each product based on the current index
    products.forEach((p, i) => (p.style.transform = `translateX(${-productIndex * 100}%)`));
  }

  /**
   * Handles the logic for navigating to the next product in the carousel.
   *
   * - If the sum of the `currentProduct` index and the number of fully visible products
   *   (`fullyShownProductNumber`) equals the last product index (`lastProduct`), it means
   *   the next product is partially visible. In this case:
   *     - Adjust the `translateAmount` to move the remaining portion of the last product
   *       into view, accounting for `partialProductPercentage`.
   * - Otherwise:
   *     - Increment the `currentProduct` index by 1 to move to the next product.
   *     - Set `translateAmount` to match the new `currentProduct` index.
   * - Finally, the `goToProduct()` method is called to adjust the carousel's position
   *   based on the updated `translateAmount`.
   *
   * @method nextProduct
   */
  nextProduct() {
    if (this.currentProduct + this.fullyShownProductNumber === this.lastProduct) {
      this.translateAmount = this.currentProduct + 1 - this.partialProductPercentage;
    } else if (this.currentProduct + this.fullyShownProductNumber < this.lastProduct) {
      this.currentProduct++;
      this.translateAmount = this.currentProduct;
    }

    this.goToProduct(this.translateAmount);
  }

  /**
   * Handles the logic for navigating to the previous product in the carousel.
   *
   * - If the current product index is 0 (indicating the first product is already fully visible),
   *   the translate amount is set to 0, and no further navigation occurs.
   * - Otherwise, the translate amount (used for calculating the position of the carousel)
   *   is decremented, and the current product index is also decremented to move
   *   to the previous product.
   * - The method then calls `goToProduct()` to adjust the carousel's position
   *   based on the updated translate amount.
   *
   * @method prevProduct
   */
  prevProduct() {
    if (this.currentProduct === 0) {
      this.translateAmount = 0;
    } else {
      this.translateAmount--;
      this.currentProduct--;
    }

    this.goToProduct(this.translateAmount);
  }

  /**
   * Calculates the number of fully and partially visible products based on the window width.
   */
  calculateVisibleProducts() {
    this.windowWidth = window.innerWidth;
    if (this.windowWidth < CONFIG.mobileBreakpoint) return;

    this.fullyShownProductNumber = Math.floor((this.windowWidth * 0.8) / CONFIG.productWidth);
    this.partialProductPercentage = +((this.windowWidth * 0.8) / CONFIG.productWidth - this.fullyShownProductNumber).toFixed(2);
  }

  /**
   * Applies the initial styles for the carousel elements.
   */
  applyStyles() {
    const styles = this.generateStyles();
    const styleSheet = this.createElement("style", "carousel-style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  /**
   * Generates the styles for the carousel elements.
   */
  generateStyles() {
    return `
    .add-to-favorite-button {
        align-items: center;
        background-color: #fff;
        border: solid .5px #b6b7b9;
        border-radius: 5px;
        box-shadow: 0 3px 6px 0 rgba(0,0,0,.16);
        cursor: pointer;
        display: flex;
        justify-content: center;
        height: 34px;
        position: absolute;
        right: 15px;
        top: 9px;
        width: 34px;
    }
    
    .favorite svg path {
        fill: #193db0;
        stroke: #193db0;
    }
    
    .carousel-container {
        font-family: "Open Sans", sans-serif;
        margin: 200px auto;
        position: relative;
        width: 80%;
    }
    .carousel-component {
        align-items: stretch;
        display: flex;
        overflow: hidden;
    }
    
    .carousel-component-title {
        color: #29323b;
        font-family: sans-serif;
        font-size: 32px;
        line-height: 43px;
    }
    
    .left-arrow-icon, 
    .right-arrow-icon {
        background: transparent;
        border: none;
        position: absolute;
        z-index: 10;
    }

    .left-arrow-icon:hover, 
    .right-arrow-icon:hover {
        cursor: pointer;
    }

    .left-arrow-icon {
        left: 0;
        top: 50%;
        transform: translate(-125%, -50%);
    }

    .right-arrow-icon {
        right: 0;
        top: 50%;
        transform: translate(125%, -50%) rotate(180deg);
    }

    .product {
        padding-right: 10px;
        transition: transform 1s;
    }

    .product a {
        display: flex;
        flex-direction: column;
        height: 100%;
        text-decoration: none;
    }
    
    .product-inner {
        background-color: #f4f5f7;
        height: 100%;
    }
    
    .product-img {
        height: 100%;
    }

    .product-img-container {
        height: 280px;
        position: relative;
    }

    .product-text {
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 8px;
        justify-content: space-between;
        padding: 10px;
    }

    .product-name {
        color: #302e2b;
        font-size: 14px;
        line-height: 20px;
        margin: 0;
    }
    
    .product-price {
        color: #193db0;
        font-size: 18px;
        font-weight: bold;
        line-height: 22px;
        margin: 0;
    }
    
    @media screen and (max-width: 960px) {
        .carousel-component {
            overflow-x: scroll;
        }

        .left-arrow-icon, 
        .right-arrow-icon {
            display: none;
        }
    }

`;
  }
}

/**
 * IIFE (Immediately Invoked Function Expression) to initialize the carousel with product data.
 * - Checks if the product detail section exists; if not, the script terminates.
 * - Loads product data from local storage or fetches it from a remote source.
 * - Initializes the `CarouselComponent` with the loaded data.
 */
(async () => {
  const productDetail = document.querySelector(".product-detail");
  if (!productDetail) return;

  let products;

  /**
   * Function to load product data
   * - Checks local storage for existing product data.
   * - If not found, fetches data from a remote JSON file.
   * - Adds an `isFav` property to each product to track favorite status.
   */
  const loadProductData = async () => {
    if (localStorage.getItem("productData")) {
      products = JSON.parse(localStorage.getItem("productData"));
    } else {
      let response = await fetch(
        "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json"
      );
      products = await response.json();

      products.forEach((item) => {
        item.isFav = false;
      });
    }
  };

  // Wait for the product data to load
  await loadProductData();

  // Initialize the CarouselComponent with the loaded products
  const newCarousel = new CarouselComponent(products);
  newCarousel.init();
})();
