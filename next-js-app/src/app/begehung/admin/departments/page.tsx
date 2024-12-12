'use client';

import CrudAdminPage from '@/components/CrudAdminPage';
import Input from '@/components/Input';

interface Department {
    id: number;
    name: string;
}

const DepartmentsAdminPage = () => {
    const entityName = 'Abteilung';
    const entityNamePlural = 'Abteilungen';
    const apiEndpoint = '/api/departments';

    const getItemDisplayName = (item: Department) => item.name;

    const renderItemFields = (
        item: Partial<Department>,
        setItemField: (fieldName: keyof Department, value: string) => void
    ) => (
        <Input
            placeholder="Abteilungsname"
            value={item.name || ''}
            onChange={(e) => setItemField('name', e.target.value)}
        />
    );

    const validateItem = (item: Partial<Department>) => {
        return !!item.name && item.name.trim().length > 0;
    };

    const errorMessages = {
        loadError: 'Fehler beim Laden der Abteilungen.',
        addError: 'Fehler beim Hinzufügen der Abteilung.',
        updateError:
            'Fehler beim Aktualisieren der Abteilung. Abteilungsname darf nicht leer und kein Duplikat sein.',
        deleteError:
            'Fehler beim Löschen der Abteilung. Bitte prüfen Sie, ob die Abteilung noch mit Fragen verknüpft ist. Abteilungen können nur gelöscht werden, wenn keine Fragen mehr verknüpft sind.',
        validationError: 'Abteilungsname darf nicht leer sein.',
        duplicateError: 'Abteilung existiert bereits.',
        unauthorizedError: 'Berechtigungsprobleme.',
        forbiddenError: 'Zugriff verweigert.',
    };

    return (
        <CrudAdminPage<Department>
            entityName={entityName}
            entityNamePlural={entityNamePlural}
            apiEndpoint={apiEndpoint}
            getItemDisplayName={getItemDisplayName}
            renderItemFields={renderItemFields}
            validateItem={validateItem}
            errorMessages={errorMessages}
        />
    );
};

export default DepartmentsAdminPage;
