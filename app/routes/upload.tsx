import {type FormEvent, useState} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        if (!auth.isAuthenticated || !auth.user) {
            navigate(`/auth?next=/upload`);
            return;
        }

        setIsProcessing(true);

        const userId = auth.user.id;
        setStatusText('Uploading the file...');
        const uploadedFile = await fs.upload([file]);
        if(!uploadedFile) return setStatusText('Error: Failed to upload file');

        setStatusText('Converting to image...');
        const imageFile = await convertPdfToImage(file);
        if(!imageFile.file) return setStatusText('Error: Failed to convert PDF to image');

        setStatusText('Uploading the image...');
        const uploadedImage = await fs.upload([imageFile.file]);
        if(!uploadedImage) return setStatusText('Error: Failed to upload image');

        setStatusText('Preparing data...');
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: '',
        }
        await kv.set(`resume:${userId}:${uuid}`, JSON.stringify(data));

        setStatusText('Analyzing...');

        try {
            const feedback = await ai.feedback(
                uploadedFile.path,
                prepareInstructions({ jobTitle, jobDescription })
            )
            if (!feedback) {
                setStatusText('Error: Failed to analyze resume. Please try again.');
                setIsProcessing(false);
                return;
            }

            const feedbackText = typeof feedback.message.content === 'string'
                ? feedback.message.content
                : feedback.message.content[0].text;

            // Extract JSON if wrapped in markdown
            const jsonMatch = feedbackText.match(/\{[\s\S]*\}/);
            const cleanJsonText = jsonMatch ? jsonMatch[0] : feedbackText;

            data.feedback = JSON.parse(cleanJsonText);
            await kv.set(`resume:${userId}:${uuid}`, JSON.stringify(data));
            setStatusText('Analysis complete, redirecting...');
            navigate(`/resume/${uuid}`);
        } catch (error) {
            console.error('Analysis error:', error);
            setStatusText('Error during analysis. Please check your file and try again.');
            setIsProcessing(false);
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="relative overflow-hidden">
            {/* Animated Blobs */}
            <div className="blob blob-1 !opacity-10"></div>
            <div className="blob blob-2 !opacity-10"></div>
            <div className="blob blob-3 !opacity-10"></div>

            <Navbar />

            <section className="main-section relative z-10">
                <div className="page-heading py-16">
                    <h1 className="text-5xl md:text-7xl">Smart feedback for your <br/><span className="text-indigo-600">dream job</span></h1>
                    {isProcessing ? (
                        <div className="flex flex-col items-center gap-6 mt-12 animate-float">
                            <h2 className="text-indigo-600 font-bold">{statusText}</h2>
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-400 blur-3xl opacity-20"></div>
                                <img src="/images/resume-scan.gif" className="w-[300px] rounded-3xl shadow-2xl relative z-10" />
                            </div>
                        </div>
                    ) : (
                        <h2 className="text-slate-500 max-w-2xl">Drop your resume for an AI-powered ATS score and deep improvement tips tailored for elite roles.</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-6 mt-12 w-full max-w-2xl bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 shadow-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                <div className="form-div">
                                    <label htmlFor="company-name">Company Name</label>
                                    <input type="text" name="company-name" placeholder="e.g. Google" id="company-name" required />
                                </div>
                                <div className="form-div">
                                    <label htmlFor="job-title">Job Title</label>
                                    <input type="text" name="job-title" placeholder="e.g. Senior Frontend Dev" id="job-title" required />
                                </div>
                            </div>
                            
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Paste the job description here for highly targeted feedback..." id="job-description" required />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume (PDF)</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button text-2xl py-5 mt-4" type="submit">
                                Analyze My Resume
                            </button>
                            <p className="text-slate-400 text-sm text-center w-full">Your data is processed securely via Puter.js AI.</p>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload
