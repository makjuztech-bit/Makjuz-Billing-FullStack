# Implementation Plan - Barcode Generator

## Objective
Add a dedicated Barcode Generator in the sidebar that allows users to generate and print barcodes (single or bulk sequence) for pasting on products.

## User Requirements
1. **Sidebar Option**: Accessible via a new sidebar link "Barcode Generator".
2. **Barcode Generation**: Support generating barcodes "with the number".
3. **Printing**: Optimize output for printing to paste on products.
4. **Optimized Workflow**: Efficient generation and printing process.

## Tech Stack
- **Library**: `react-barcode` for rendering SVG barcodes.
- **Printing**: `react-to-print` for handling the print dialogue and styling specifically for printer output.
- **UI**: standard Shadcn UI components.

## Implementation Steps

### 1. Install Dependencies
   - Command: `npm install react-barcode react-to-print`

### 2. Create Page Component: `src/pages/BarcodeGenerator.tsx`
   - **Input Section**:
     - **Mode Selection**: "Single Item" vs "Batch / Range".
     - **Inputs**:
       - `Barcode Value` (for single) or `Prefix` + `Start Number` + `Count` (for batch).
       - `Copies` (copies per barcode).
     - **Settings**:
       - `Label Size`: select standard sticker sheet presets (e.g., 24-up A4, 40-up A4, or Single Thermal).
   - **Preview Data**:
     - Calculate the list of barcodes to render based on inputs.
   - **Print Area**:
     - A formatted `div` that mimics the customized paper size.
     - Maps over the barcode list and renders `<Barcode />` components.
     - CSS Grid used for alignment.

### 3. Update Navigation
   - Modify `src/components/MainLayout.tsx`:
     - Add `Barcode` item to `navItems` config.
     - Link to `/tools/barcode-generator` or similar.

### 4. Update Routing
   - Modify `src/App.tsx`:
     - Add `<Route path="/barcode-generator" element={<BarcodeGenerator />} />`.

### 5. Styles & Optimization
   - Add `@media print` styles to ensuring only the barcode grid is printed, hiding navigation and headers.
   - Ensure the barcode SVG is legible and scalable.

## Verification
- User navigates to "Barcode Generator".
- Enters "SILK-100", Quantity "50".
- Sees 50 barcodes covering "SILK-100" to "SILK-149".
- Clicks Print.
- Print Preview shows clean grid without UI chrome.
