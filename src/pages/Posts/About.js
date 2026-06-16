import React from "react";
import Spacer from "@components/Spacer";
import { SITE_NAME } from "../../config/config";
import { useLocalization } from "../../util/LocalizationContext";

const About = () => {
    const currentYear = new Date().getFullYear();
    const { t } = useLocalization();

    return <>
        <h2>
            {t('about.title').replace('{SITE_NAME}', SITE_NAME)}
        </h2>

        <p>
            <strong>{SITE_NAME}</strong> {t('about.intro').replace('{SITE_NAME}', SITE_NAME).replace(`${SITE_NAME} `, '')}
        </p>

        <ul>
            <li><strong>{t('about.mathSubject')}</strong> - {t('about.mathTopics')}</li>
            <li><strong>{t('about.physicsSubject')}</strong> - {t('about.physicsTopics')}</li>
            <li><strong>{t('about.lifeSubject')}</strong> - {t('about.lifeTopics')}</li>
        </ul>

        <h3>{t('about.capsAlignedTitle')}</h3>
        <p>
            {t('about.capsAlignedDesc')}
        </p>

        <h3>{t('about.howItWorksTitle')}</h3>
        <p>
            {t('about.howItWorksDesc').replace('{SITE_NAME}', SITE_NAME)}
        </p>

        <h3>{t('about.featuresTitle')}</h3>
        <ul>
            <li>{t('about.feature1')}</li>
            <li>{t('about.feature2')}</li>
            <li>{t('about.feature3')}</li>
            <li>{t('about.feature4')}</li>
            <li>{t('about.feature5')}</li>
            <li>{t('about.feature6')}</li>
        </ul>

        <h3>{t('about.targetAudienceTitle')}</h3>
        <p>
            {t('about.targetAudienceDesc').replace('{SITE_NAME}', SITE_NAME)}
        </p>

        <Spacer height={24 * 1}/>

        <sub>
            <p>
                {t('about.poweredBy').replace('{SITE_NAME}', SITE_NAME)}
            </p>
            <p>
                {t('about.license')}
            </p>
            <p>{t('about.copyright').replace('{year}', currentYear).replace('{SITE_NAME}', SITE_NAME)}</p>
        </sub>
    </>
}

export default About
