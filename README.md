# Mock Store for Qualtrics

A small fictional online store that runs inside a Qualtrics question. Respondents browse a few products, view product pages with image galleries, add one item to the cart, and see the cart. The Qualtrics Next button stays hidden until something is in the cart. Everything they do is saved into the respondent's embedded data.

## What's in this folder

| File | What it is |
|---|---|
| `index.html` | The store. You shouldn't need to edit it. |
| `settings.csv` | Store-wide settings: store name, colors, menu labels, feature switches. |
| `products.csv` | One row per product: name, color, price, description, features, specs, images, reviews. |
| `qualtrics-simulator.html` | A test page that mimics the Qualtrics question, so you can check everything before touching the survey. |
| `qualtrics/question-html.txt` | Code to paste into the store question's HTML View. |
| `qualtrics/question.js` | Code to paste into the store question's JavaScript. |
| `build.py` | Optional. Copies the CSVs into `index.html` as a backup in case the CSV files can't load. |

## Editing the store

Open the CSV files in Excel or Google Sheets, edit, and save as CSV (keep the column names as they are). On GitHub you can also edit them directly in the browser.

**settings.csv** has one setting per row (`key`, `value`, and a `notes` column explaining each one). Feature switches take `TRUE` or `FALSE`:

- `reviews_enabled`: star ratings and reviews on product cards and pages
- `promo_banner_enabled`: banner across the top of every page
- `promo_badges_enabled`: badges ("Best seller") and strikethrough compare-at prices
- `free_shipping_notice_enabled`: free shipping line on product and cart pages

All are off for the current study.

**products.csv** columns:

- `id`: short unique code (p1, p2, ...). Don't reuse codes across rows.
- `name`, `color_name`, `price`, `compare_at_price` (only shown when badges are on)
- `swatch`: color dot shown on the product page, as a hex code like `#2E4A6B`
- `short_description`, `description`
- `features`: bullet points separated by `|`
- `specs`: specification rows separated by `|`, each written as `Label: value`
- `images`: image links separated by `|`. Leave empty to use labeled placeholders. The first image is used on the catalog card and in the cart.
- `badge`, `rating`, `review_count`
- `reviews`: separate reviews with `||`; each review is `Name~stars~Text`

Product order in the sheet is the order on the page, and it also sets the numbering in the data (`store_p1_...` is the first row). Keep the order fixed once data collection starts.

**Images:** put image files in an `images` folder in the repository and list them as `images/p1-front.jpg|images/p1-side.jpg`, or use full links to images hosted anywhere. Square images (for example 1200×1200) look best.

## Testing

- **Simulator:** open `qualtrics-simulator.html` from the GitHub Pages site (see below). It shows the store inside a fake survey page with a Next button, and a panel listing exactly what Qualtrics would receive.
- **Test panel:** add `?test=1` to the store address (for example `https://your-username.github.io/your-repo/?test=1&cond=2`) to see the data live while you click around.
- Opening `index.html` directly from your computer works too, but it uses the backup copy of the sheets inside the file (run `build.py` to refresh it). The data records this as `store_data_source = fallback`.

## Putting it on GitHub Pages

1. Sign in to GitHub and click **New repository** (the + menu at top right).
2. Give it a neutral name (for example `store`). Choose **Public** (Private only works once your teacher benefits are approved). Click **Create repository**.
3. On the new repository's page, click **uploading an existing file**, drag in everything in this folder (keep the `qualtrics` folder too), and click **Commit changes**.
4. Go to **Settings → Pages**. Under **Build and deployment**, set Source to **Deploy from a branch**, Branch to **main** and folder **/ (root)**, then **Save**.
5. After a minute or two, the page shows your site address, something like `https://your-username.github.io/store/`. Open it to check the store loads.

To change products later, edit `products.csv` on GitHub (click the file, then the pencil icon) and commit. Changes go live within a few minutes. Don't edit during data collection.

## Setting up the Qualtrics survey

1. **Survey Flow:** add an Embedded Data element at the top that sets your condition field (for example `condition`), assigned by your Randomizer. Add a second Embedded Data element (above the store block) that declares every `store_` field listed below, leaving the values empty.
   - **Simple layout** (the newer default look): name each field with a `__js_` prefix, for example `__js_store_cart_item`. They appear without the prefix in your data export.
   - **Classic layouts:** use the names as listed, no prefix.
2. **Store question:** add a Text / Graphic question. Click the question text, choose **HTML View**, and paste `qualtrics/question-html.txt`. Replace `YOUR-USERNAME` and `YOUR-REPO` with yours.
3. **JavaScript:** on the same question, open the gear menu, choose **Add JavaScript**, replace everything in the box with `qualtrics/question.js`, and save.
4. Put a page break after the store question, then your abandonment scenario and the email images. To show the email matching the respondent's chosen color, use Display Logic on each image based on `store_cart_item` (1 to 6).
5. Preview the survey and check the Next button appears only after adding to cart. After a test response, confirm the `store_` fields have values in Data & Analysis.

## Data fields

All times are in seconds. Product numbers (1 to 6) follow the row order in `products.csv`.

| Field | Meaning |
|---|---|
| `store_rid` | Qualtrics ResponseID passed to the store |
| `store_cond` | Condition passed to the store |
| `store_product_set` | `product_set_label` from settings, so you know which product set was shown |
| `store_data_source` | `sheet` normally; `fallback` if the backup copy inside the page was used |
| `store_start_time` | When the store loaded (UTC) |
| `store_total_time_s` | Total time in the store |
| `store_pageviews` | Number of pages viewed |
| `store_path` | Sequence of pages: H = catalog, P3 = product 3, C = cart |
| `store_home_time_s`, `store_cart_time_s` | Time on the catalog and cart pages |
| `store_p1_views` … `store_p6_views` | Times each product page was opened |
| `store_p1_time_s` … `store_p6_time_s` | Time on each product page |
| `store_p1_gallery_clicks` … `store_p6_gallery_clicks` | Image gallery clicks on each product page |
| `store_products_viewed` | Which product pages were opened, e.g. `1,3,5` |
| `store_n_products_viewed` | How many different product pages were opened |
| `store_first_product_viewed` | First product page opened |
| `store_gallery_clicks` | Total gallery clicks (thumbnails and arrows) |
| `store_swatch_clicks` | Color swatch clicks (switching between variants on a product page) |
| `store_menu_clicks`, `store_back_clicks` | Menu and breadcrumb clicks |
| `store_cart_adds`, `store_cart_removes`, `store_cart_replacements` | Cart activity (replacement = adding a different item when one was already in the cart) |
| `store_first_added` | First product added to the cart |
| `store_time_to_first_add_s` | Time from store load to first add |
| `store_cart_item` | Product in the cart when the respondent moved on (1 to 6) |
| `store_cart_item_id`, `store_cart_item_name`, `store_cart_item_color`, `store_cart_price` | Details of that product |
| `store_checkout_clicks` | Clicks on the inactive checkout button |
| `store_continue_clicks` | "Continue shopping" clicks |
| `store_window_blurs` | Times the respondent switched away from the page (another tab or window) |
| `store_event_log` | Every event with a timestamp in milliseconds, as JSON: `[time, event, detail]` |
| `store_event_log_truncated` | 1 if the log hit its size limit and the oldest events were dropped |
| `store_load_error` | Set only if the store failed to load (the Next button is then shown so the respondent isn't stuck) |

Event log codes: `start`, `view_home`, `view_product` (product:how they got there), `view_cart`, `gallery` (product:image:control), `cart_add`, `cart_remove`, `cart_replace` (old>new), `checkout_click`, `menu`, `logo`, `blur`, `focus`.

## Optional: edit products in a Google Sheet instead

Make a Google Sheet with the same columns, then **File → Share → Publish to web**, choose the products tab and **Comma-separated values**, and copy the link. Add it to the store address in the Qualtrics iframe: `...?products=` followed by the link (do the same with `settings=` for a settings tab). Google can take a few minutes to update a published sheet, and the published link is public. Test with the simulator before relying on it.
