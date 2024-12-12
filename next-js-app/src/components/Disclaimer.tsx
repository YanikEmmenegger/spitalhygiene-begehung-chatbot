'use client'
import React, {useEffect, useState} from 'react';
import Cookies from 'js-cookie'; // Import js-cookie
import {motion} from 'framer-motion';
import Button from "@/components/Button"; // Import framer-motion

const Disclaimer: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);

    // Check if disclaimer cookie exists and hide disclaimer if it does
    useEffect(() => {
        const cookieExists = Cookies.get('disclaimerAccepted');
        setIsVisible(!cookieExists); // Show disclaimer if no cookie is found
    }, []);

    // Handle the acceptance of the disclaimer and set a 30-day cookie
    const handleAccept = () => {
        Cookies.set('disclaimerAccepted', 'true', {expires: 30, path: '/'});
        setIsFadingOut(true); // Trigger fade-out animation

        // Hide disclaimer after animation
        setTimeout(() => {
            setIsVisible(false);
        }, 500);
    };

    if (!isVisible) return null; // Don't render the disclaimer if cookie exists

    return (
        <motion.div
            initial={{opacity: 1}}
            animate={{opacity: isFadingOut ? 0 : 1}}
            transition={{duration: 0.3}}
            className="fixed w-screen h-screen flex items-center justify-center bg-gray-100 backdrop-blur-lg z-50"
        >
            {/* Main Disclaimer Box */}
            <div
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl md:max-h-[80vh] md:h-auto h-screen overflow-auto md:w-11/12 lg:w-9/12 xl:w-3/4 relative">
                <h1 className="text-2xl font-bold text-left text-gray-700 mb-5">
                    Disclaimer
                </h1>
                <p className="text-sm text-gray-600 mb-6">
                    Alle Angaben und Auskünfte des Chatbots sind ohne Gewähr und lediglich als allgemeine Hilfestellung
                    zu verstehen. Im Zweifelsfall wird empfohlen, den Hygieneordner für verbindliche Auskünfte zu
                    konsultieren (entsprechende Dokumente sind in Antworten jeweils verlinkt.
                    Jegliche Haftung für Verluste oder Schäden irgendwelcher Art, die aus oder im Zusammenhang mit dem
                    Zugriff, der Benutzung (insbesondere bei inhaltlichen Fehlern) bzw. Unmöglichkeit der Nutzung oder
                    dem Abfragen der Webseite entstehen können, wird abgelehnt.
                    <br/>
                    <br/>
                    <b>Gewährleistung des Inhalts der Webseite</b><br/>
                    Die Angaben auf diesen Internetseiten sind unverbindlich und ausschliesslich zu Informationszwecken
                    zur Verfügung gestellt. Die bereitgestellten Informationen gelten explizit nicht als Angebot und
                    ersetzen in keiner Weise die persönliche Beratung und/oder Prüfung durch einen Arzt oder
                    qualifiziertes medizinisches Fachpersonal – weder für in- und ausländische Patienten, noch für
                    Kooperationspartner wie Forschungsinstitutionen, Spitäler etc. Die Insel Gruppe AG übernimmt trotz
                    sorgfältiger Bereitstellung der Informationen auf den von ihr veröffentlichten Internetseiten keine
                    Gewähr für die Aktualität, Korrektheit, Vollständigkeit und Qualität der dargebotenen Informationen.
                    Haftungsansprüche gegen die Insel Gruppe AG, welche sich auf Schäden materieller oder ideeller Art
                    beziehen, die durch die Nutzung oder Nichtnutzung der dargebotenen Informationen bzw. durch die
                    Nutzung fehlerhafter und unvollständiger Informationen verursacht wurden, sind grundsätzlich
                    ausgeschlossen. Alle Informationen sind freibleibend und unverbindlich. Die Insel Gruppe AG behält
                    sich ausdrücklich vor, Teile der Seiten oder den gesamten Auftritt ohne gesonderte Ankündigung zu
                    verändern, zu ergänzen, zu löschen oder die Veröffentlichung zeitweise oder endgültig einzustellen.
                    Gewährleistung der Links zu externen Seiten
                    <br/>
                    <br/>
                    Die Insel Gruppe AG prüft insbesondere bei Aufnahme von externen Links in ihre Website, ob die
                    verlinkten externen Seiten rechtswidrige Inhalte aufweisen. Da die Insel Gruppe AG keinerlei
                    Einfluss auf die weitere Gestaltung dieser Webseiten hat, auf die die Links ihrer eigenen Website
                    hinweisen, kann sie keine Haftung für den Inhalt dieser Webseiten übernehmen. Sollte die Insel
                    Gruppe AG Kenntnis von illegalen Inhalten der von ihr verlinkten externen Seiten erhalten, so wird
                    sie die entsprechenden Links von ihrer Seite entfernen. Dasselbe gilt auch für Fremdeinträge in von
                    der Insel Gruppe AG eingerichteten Gästebüchern, Diskussionsforen und Mailinglisten.
                    <br/>
                    <br/>
                    <b>Urheber- und Kennzeichenrecht</b>
                    <br/>
                    Die Insel Gruppe AG ist bestrebt, in allen Publikationen die Urheberrechte der verwendeten Grafiken,
                    Tondokumente, Videosequenzen und Texte zu beachten, von ihr selbst erstellte Grafiken, Tondokumente,
                    Videosequenzen und Texte zu nutzen oder auf lizenzfreie Grafiken, Tondokumente, Videosequenzen und
                    Texte zurückzugreifen. Alle innerhalb des Internetangebotes genannten und ggf. durch Dritte
                    geschützten Marken- und Warenzeichen unterliegen uneingeschränkt den Bestimmungen des jeweils
                    gültigen Kennzeichenrechts und den Besitzrechten der jeweiligen eingetragenen Eigentümer. Allein
                    aufgrund der blossen Nennung ist nicht der Schluss zu ziehen, dass Markenzeichen nicht durch Rechte
                    Dritter geschützt sind.
                    <br/>
                    <br/>
                    Das Copyright für veröffentlichte, von der Insel Gruppe AG selbst erstellte Objekte bleibt allein
                    bei der Insel Gruppe AG. Eine Vervielfältigung oder Verwendung solcher Grafiken, Tondokumente,
                    Videosequenzen und Texte in anderen elektronischen oder gedruckten Publikationen ist ohne
                    ausdrückliche Zustimmung der Insel Gruppe AG nicht gestattet.
                    <br/>
                    <br/>
                    <b>Rechtswirksamkeit dieses Haftungsausschlusses</b>
                    <br/>
                    Sollten Teile oder einzelne Formulierungen dieser rechtlichen Hinweise nichtig sein, so bleiben die
                    anderen Teile der Hinweise weiterhin bestehen und der nichtige Teil soll von den Vertragsparteien
                    möglichst in dem Sinne interpretiert werden, dass der ursprünglich mit der nichtigen Formulierung
                    beabsichtigte Zweck soweit als möglich weiter bestehen kann.
                    <br/>
                    <br/>
                    <b>Schreibweisen</b>
                    <br/>
                    Aus Gründen der besseren Lesbarkeit wird vielerorts darauf verzichtet, beide Geschlechter zu nennen.
                    Es wird jedoch darauf hingewiesen, dass im gesamten Bereich unseres Webauftritts und in allen
                    Dokumenten beide Geschlechter gleichberechtigt angesprochen werden.
                </p>

                {/* Accept Button */}
                <div className="flex justify-center">
                    <Button  onClick={handleAccept} className="w-full">
                        Akzeptieren
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default Disclaimer;
