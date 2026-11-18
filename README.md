<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fast Image Converter</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-white min-h-screen flex items-center justify-center p-4">

    <div class="bg-slate-800 p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-700">
        <h1 class="text-2xl font-bold mb-2 text-center text-blue-400">Image Format Converter</h1>
        <p class="text-slate-400 text-sm text-center mb-6">100% Private • Instant Browser Conversion</p>

        <!-- File Upload Area -->
        <label class="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-slate-700/50 transition">
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <p class="mb-2 text-sm text-slate-300"><span class="font-semibold">Click to upload</span> or drag & drop</p>
                <p class="text-xs text-slate-500" id="file-name">PNG, JPG, WEBP, GIF, BMP</p>
            </div>
            <input id="imageInput" type="file" accept="image/*" class="hidden" />
        </label>

        <!-- Format & Quality Selection -->
        <div class="mt-6 space-y-4">
            <div>
                <label class="block text-sm font-medium text-slate-300 mb-1">Convert To Format:</label>
                <select id="formatSelect" class="w-full bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-blue-500 focus:border-blue-500">
                    <option value="image/webp">WEBP (Best for Web)</option>
                    <option value="image/jpeg">JPG / JPEG</option>
                    <option value="image/png">PNG (Transparent)</option>
                </select>
            </div>

            <div id="qualityContainer">
                <label class="block text-sm font-medium text-slate-300 mb-1">
                    Quality: <span id="qualityValue">90</span>%
                </label>
                <input id="qualitySlider" type="range" min="10" max="100" value="90" class="w-full accent-blue-500">
            </div>
        </div>

        <!-- Convert & Download Button -->
        <button id="convertBtn" disabled class="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition">
            Convert & Download
        </button>
    </div>

    <canvas id="canvas" class="hidden"></canvas>

    <script>
        const imageInput = document.getElementById('imageInput');
        const fileNameDisplay = document.getElementById('file-name');
        const formatSelect = document.getElementById('formatSelect');
        const qualitySlider = document.getElementById('qualitySlider');
        const qualityValue = document.getElementById('qualityValue');
        const qualityContainer = document.getElementById('qualityContainer');
        const convertBtn = document.getElementById('convertBtn');
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        let selectedFile = null;

        // File select thay tyare
        imageInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                selectedFile = e.target.files[0];
                fileNameDisplay.textContent = selectedFile.name;
                fileNameDisplay.classList.add('text-blue-400');
                convertBtn.disabled = false;
            }
        });

        // Quality slider update
        qualitySlider.addEventListener('input', (e) => {
            qualityValue.textContent = e.target.value;
        });

        // PNG ma quality slider ni jarur nathi
        formatSelect.addEventListener('change', (e) => {
            qualityContainer.style.display = e.target.value === 'image/png' ? 'none' : 'block';
        });

        // Conversion logic
        convertBtn.addEventListener('click', () => {
            if (!selectedFile) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;

                    // JPG mate white background set karvu (transparent image black na thay etle)
                    if (formatSelect.value === 'image/jpeg') {
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }

                    ctx.drawImage(img, 0, 0);

                    const format = formatSelect.value;
                    const quality = qualitySlider.value / 100;
                    const dataUrl = canvas.toDataURL(format, quality);

                    // File download karava mate
                    const ext = format.split('/')[1];
                    const originalName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
                    
                    const link = document.createElement('a');
                    link.download = `${originalName}.${ext}`;
                    link.href = dataUrl;
                    link.click();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(selectedFile);
        });
    </script>
</body>
</html>
