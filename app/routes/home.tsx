import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import {resumes} from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {useLocation, useNavigate} from "react-router";
import {useEffect, useState} from "react";
import resume from "~/routes/resume";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Resumind" },
        { name: "description", content: "Smart feedback for your dream job!" },
    ];
}

export default function Home() {
    const {auth,fs}=usePuterStore();
    const navigate=useNavigate();
    const [resumeUrl,setResumeUrl]=useState('');

    useEffect(()=>{
        if(!auth.isAuthenticated) navigate('/auth?next=/');
    }, [auth.isAuthenticated])

    return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
        <Navbar />

        <section className="main-section">
            <div className="page-heading py-16">
                <h1>Track Your Application & Resume Ratings</h1>
                <h2>Review your submissions and check AI-powered feedback.</h2>
            </div>


            {resumes.length > 0 && (
                <div className="resumes-section">
                    {resumes.map(resume => (
                        <ResumeCard key={resume.id} resume={resume} />
                    ))}
                </div>
            )}
        </section>
    </main>
}
