import React from "react";
import Spacer from "@components/Spacer";
import { SITE_NAME } from "../../config/config";

const About = () => {
    const currentYear = new Date().getFullYear();

    return <>
        <h2>
            About {SITE_NAME}
        </h2>

        <p>
            <strong>{SITE_NAME}</strong> is South Africa's premier online tutoring platform designed specifically
            for Grade 10-12 students preparing for their NSC examinations. Our platform covers:
        </p>

        <ul>
            <li><strong>Mathematics</strong> - Euclidean Geometry, Trigonometry, Analytical Geometry, Statistics</li>
            <li><strong>Physical Sciences</strong> - Mechanics, Electricity, Waves, Organic Chemistry, Electrochemistry</li>
            <li><strong>Life Sciences</strong> - Genetics, Evolution, Nervous System, Reproduction</li>
        </ul>

        <h3>CAPS Curriculum Aligned</h3>
        <p>
            All content is aligned with the South African CAPS (Curriculum and Assessment Policy Statement)
            curriculum, using real NSC past paper questions to ensure you're practicing with exam-relevant material.
        </p>

        <h3>How It Works</h3>
        <p>
            {SITE_NAME} uses adaptive learning technology to personalize your learning experience.
            The system tracks your progress and identifies areas where you need more practice,
            providing hints and step-by-step guidance when you need it.
        </p>

        <h3>Features</h3>
        <ul>
            <li>Interactive step-by-step problem solving</li>
            <li>Intelligent hint system</li>
            <li>Progress tracking</li>
            <li>Works offline (PWA enabled)</li>
            <li>Mobile-friendly design</li>
            <li>Free to use</li>
        </ul>

        <h3>Target Audience</h3>
        <p>
            {SITE_NAME} is designed for South African students in the Western Cape, Northern Cape,
            and across the country who want to excel in their Grade 10, 11, and 12 examinations.
        </p>

        <Spacer height={24 * 1}/>

        <sub>
            <p>
                {SITE_NAME} is powered by OATutor, an open-source adaptive tutoring system
                developed by the CAHL Research Lab at UC Berkeley School of Education.
            </p>
            <p>
                Platform licensed under MIT Open Source License.
                Content licensed under CC BY 4.0.
            </p>
            <p>© {currentYear} {SITE_NAME}. All rights reserved.</p>
        </sub>
    </>
}

export default About
