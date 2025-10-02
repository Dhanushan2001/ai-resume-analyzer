export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    isLoading = true;
    // Prefer Vite-friendly imports. Fallback to self-hosted worker in /public.
    loadPromise = (async () => {
        try {
            const lib = await import("pdfjs-dist/build/pdf.mjs");
            try {
                // In Vite, importing the worker URL via ?url works.
                // @ts-ignore - Vite query import
                const workerUrl: string = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
                lib.GlobalWorkerOptions.workerSrc = workerUrl;
            } catch {
                // Fallback to a copy in public
                lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
            }
            pdfjsLib = lib;
            return lib;
        } finally {
            isLoading = false;
        }
    })();

    return loadPromise;
}

export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    try {
        const lib = await loadPdfJs();

        if (!file || !file.type?.toLowerCase().includes("pdf")) {
            return { imageUrl: "", file: null, error: "Provided file is not a PDF" };
        }

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = lib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        if (!pdf || pdf.numPages < 1) {
            return { imageUrl: "", file: null, error: "PDF has no pages" };
        }
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 3 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) {
            return { imageUrl: "", file: null, error: "Could not create 2D canvas context" };
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";

        await page.render({ canvasContext: context, viewport }).promise;

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        // Create a File from the blob with the same name as the pdf
                        const originalName = file.name.replace(/\.pdf$/i, "");
                        const imageFile = new File([blob], `${originalName}.png`, {
                            type: "image/png",
                        });

                        resolve({
                            imageUrl: URL.createObjectURL(blob),
                            file: imageFile,
                        });
                    } else {
                        resolve({
                            imageUrl: "",
                            file: null,
                            error: "Failed to create image blob",
                        });
                    }
                },
                "image/png",
                0.92
            );
        });
    } catch (err: any) {
        const message = err?.message || String(err);
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${message}`,
        };
    }
}