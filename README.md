# PDF Editor

A powerful, mobile-friendly React application for editing PDF files directly in your browser. No uploads to servers - all processing happens locally for maximum privacy and speed.

## 🌟 Features

### 🔄 Reorder Pages

- **Upload any PDF** - Select a PDF file to reorder its pages
- **Visual page list** - See all pages with their current positions
- **Drag-and-drop reordering** - Easily rearrange pages by dragging them
- **Arrow button controls** - Use up/down arrows for precise positioning
- **Reset option** - Quickly restore original page order
- **Live preview** - See the new page order before saving
- **One-click save** - Download PDF with pages in new order

### 📑 Merge PDFs

- **Add PDFs incrementally** - Select one PDF at a time or multiple files
- **Add more anytime** - Click "Add More PDFs" to keep adding files to your merge queue
- **Drag-and-drop reordering** - Easily rearrange PDFs by dragging them up or down
- **Visual file list** - See all selected files with the ability to remove any unwanted ones
- **One-click merge** - Combine all PDFs into a single document
- **Smart validation** - Ensures at least 2 PDFs are selected before merging

### 📄 Extract Pages

- **Upload any PDF** - Select a PDF file to work with
- **Extract all pages** - Download every page as separate PDF files with one click
- **Extract individual pages** - Choose specific pages to download
- **Page preview** - See total page count before extracting
- **Batch processing** - Efficient handling of large PDFs with multiple pages

### 🗑️ Remove Pages

- **Page selection interface** - Visual grid showing all pages in your PDF
- **Click to select** - Mark pages for removal with a single click
- **Bulk actions** - Select all or deselect all pages quickly
- **Visual feedback** - Selected pages are highlighted in red
- **Smart removal** - Delete selected pages and download the remaining PDF
- **Page count display** - Shows how many pages will be removed

## 📱 Mobile Compatibility

Fully optimized for mobile browsers:

- ✅ **Android Chrome** - Full download support
- ✅ **iOS Safari** - Seamless PDF handling
- ✅ **Touch-optimized UI** - Large tap targets and smooth interactions
- ✅ **Responsive design** - Works perfectly on phones, tablets, and desktops

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/abiralaminn/pdf-editor.git
cd pdf-editor
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The app will open at `http://localhost:3000`

## 🛠️ Technologies Used

- **React 18.2.0** - UI framework
- **pdf-lib** - PDF manipulation library for creating and modifying PDFs
- **Create React App** - Project setup and build tools
- **CSS3** - Styling with gradients and animations
- **HTML5 Drag & Drop API** - File reordering functionality

## 📦 Build for Production

Create an optimized production build:

```bash
npm run build
```

The build folder will contain the production-ready files.

## 🌐 Deploy to GitHub Pages

This project is configured for easy deployment to GitHub Pages:

```bash
npm run deploy
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 💡 How to Use

### Reordering Pages

1. Click "Select PDF File" and choose a PDF
2. Drag pages up or down to reorder them, or use arrow buttons
3. Click "Reset Order" to restore original sequence
4. Click "Save & Download Reordered PDF" to get your file
5. The downloaded PDF will have pages in the new order

### Merging PDFs

1. Click "Select PDF Files" to choose your first PDF(s)
2. Click "Add More PDFs" to add additional files
3. Drag files up or down to reorder them
4. Click "Merge PDFs" to combine them into one document
5. The merged PDF will automatically download

### Extracting Pages

1. Click "Select PDF File" and choose a PDF
2. Click "Download All Pages Separately" for all pages, or
3. Click individual page buttons to download specific pages
4. Each page downloads as a separate PDF file

### Removing Pages

1. Click "Select PDF File" and choose a PDF
2. Click on pages you want to remove (they'll turn red)
3. Use "Select All" or "Deselect All" for bulk actions
4. Click "Remove X Page(s) & Download" to get your edited PDF
5. The downloaded PDF will exclude all selected pages

## 🎨 Features Highlights

- **Toast Notifications** - In-page success and error messages
- **No Server Required** - All processing happens in your browser
- **Privacy First** - Your PDFs never leave your device
- **Fast Processing** - Leverages modern browser capabilities
- **Clean UI** - Modern gradient design with intuitive controls
- **Mobile-First** - Optimized download utilities for all platforms

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

**Abir Alam**

- GitHub: [@abiralaminn](https://github.com/abiralaminn)

## 🙏 Acknowledgments

- pdf-lib library for powerful PDF manipulation
- React community for excellent tools and documentation
