import React from "react";
import Spacer from "@components/Spacer";
import { useStyles } from "./Posts";
import { HELP_DOCUMENT, SITE_NAME } from "../../config/config";
import { useLocalization } from "../../util/LocalizationContext";

const VPAT_LINK = `${process.env.PUBLIC_URL}/static/documents/OATutor_Sec508_WCAG.pdf`

const HowToUse = () => {
    const classes = useStyles()
    const { t } = useLocalization();

    return <>
        <h1>
            {t('howToUse.title').replace('{SITE_NAME}', SITE_NAME)}
        </h1>
        <h2>
            {t('howToUse.subtitle')}
        </h2>
        <h4 style={{
            marginTop: 0
        }}>
            {t('howToUse.lastUpdated')} {new Date(1643007791501).toLocaleString()}
        </h4>

        <h4>{t('howToUse.inputTypesTitle')}</h4>

        {t('howToUse.inputTypesDesc').replace('{SITE_NAME}', SITE_NAME)}<span> </span>
        <a href={HELP_DOCUMENT} target={"_blank"} rel={"noreferrer"}>{t('howToUse.visitHelpDoc')}</a>.

        <h4>{t('howToUse.accessibilityTitle')}</h4>

        <p>
            {t('howToUse.accessibilityDesc').replace(/{SITE_NAME}/g, SITE_NAME)}
        </p>

        <p className={classes["pt-2"]}>
            {t('howToUse.vpatDesc').replace('{SITE_NAME}', SITE_NAME)}
        </p>

        <p className={classes["pt-2"]}>
            {t('howToUse.vpatLink')}<span> </span>
            <a href={VPAT_LINK} target={"_blank"} rel={"noreferrer"}>{VPAT_LINK.match(/\/[^/]*$/)[0].substr(1)}</a>
        </p>

        <Spacer height={24 * 8}/>
    </>
}

export default HowToUse
