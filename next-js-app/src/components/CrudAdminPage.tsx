'use client';

import {useEffect, useState} from 'react';
import axios from 'axios';
import Button from '@/components/Button';

interface CrudAdminPageProps<Item extends { id: number }> {
    entityName: string; // Singular form, e.g., 'Abteilung'
    entityNamePlural: string; // Plural form, e.g., 'Abteilungen'
    apiEndpoint: string; // API endpoint, e.g., '/api/departments'
    getItemDisplayName: (item: Item) => string; // Function to get item display name
    renderItemFields: (
        item: Partial<Item>,
        setItemField: (fieldName: keyof Item, value: any) => void,
        isEditing: boolean
    ) => JSX.Element; // Function to render input fields
    validateItem: (item: Partial<Item>) => boolean; // Function to validate item
    errorMessages: {
        loadError: string;
        addError: string;
        updateError: string;
        deleteError: string;
        validationError: string;
        duplicateError: string;
        unauthorizedError: string;
        forbiddenError: string;
    };
}

function CrudAdminPage<Item extends { id: number }>({
                                                        entityName,
                                                        entityNamePlural,
                                                        apiEndpoint,
                                                        getItemDisplayName,
                                                        renderItemFields,
                                                        validateItem,
                                                        errorMessages,
                                                    }: CrudAdminPageProps<Item>) {
    const [items, setItems] = useState<Item[]>([]);
    const [newItem, setNewItem] = useState<Partial<Item>>({});
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    const [editingItem, setEditingItem] = useState<Partial<Item>>({});
    const [error, setError] = useState<string | null>(null);
    const [loadingAdd, setLoadingAdd] = useState<boolean>(false);
    const [loadingSave, setLoadingSave] = useState<boolean>(false);
    const [loadingDeleteId, setLoadingDeleteId] = useState<number | null>(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get(apiEndpoint);
            setItems(response.data.data);
            setError(null);
        } catch (err) {
            console.log(err);
            setError(errorMessages.loadError);
        }
    };

    const handleAddItem = async () => {
        if (!validateItem(newItem)) {
            setError(errorMessages.validationError);
            return;
        }
        setLoadingAdd(true);
        try {
            await axios.post(apiEndpoint, newItem);
            setNewItem({});
            fetchItems();
            setError(null);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 409) {
                    setError(errorMessages.duplicateError);
                } else if (err.response?.status === 401) {
                    setError(errorMessages.unauthorizedError);
                } else {
                    setError(errorMessages.addError);
                }
            } else {
                setError(errorMessages.addError);
            }
        } finally {
            setLoadingAdd(false);
        }
    };

    const handleEditItem = (item: Item) => {
        setEditingItemId(item.id);
        setEditingItem({...item});
    };

    const handleUpdateItem = async () => {
        if (!validateItem(editingItem) || editingItemId === null) {
            setError(errorMessages.validationError);
            return;
        }
        setLoadingSave(true);
        try {
            await axios.patch(`${apiEndpoint}/${editingItemId}`, editingItem);
            setEditingItemId(null);
            setEditingItem({});
            fetchItems();
            setError(null);
        } catch (err) {
            console.log(err);
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 409) {
                    setError(errorMessages.duplicateError);
                } else {
                    setError(errorMessages.updateError);
                }
            } else {
                setError(errorMessages.updateError);
            }
        } finally {
            setLoadingSave(false);
        }
    };

    const handleDeleteItem = async (id: number) => {
        const confirmDelete = window.confirm(`Möchten Sie diese ${entityName} wirklich löschen?`);
        if (!confirmDelete) return;

        setLoadingDeleteId(id);

        try {
            await axios.delete(`${apiEndpoint}/${id}`);
            fetchItems();
            setError(null);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 403) {
                    setError(err.response?.data.error || errorMessages.deleteError);
                } else if (err.response?.status === 401) {
                    setError(errorMessages.unauthorizedError);
                } else {
                    setError(errorMessages.deleteError);
                }
            } else {
                setError(errorMessages.deleteError);
            }
        } finally {
            setLoadingDeleteId(null);
        }
    };

    const setNewItemField = (fieldName: keyof Item, value: any) => {
        setNewItem((prev) => ({...prev, [fieldName]: value}));
    };

    const setEditingItemField = (fieldName: keyof Item, value: any) => {
        setEditingItem((prev) => ({...prev, [fieldName]: value}));
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">{entityNamePlural} verwalten</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Add Item */}
            <div className="mb-6">
                <h2 className="text-xl font-medium mb-2">Neue {entityName} hinzufügen</h2>
                <div className="flex gap-2">
                    {renderItemFields(newItem, setNewItemField, false)}
                    <Button onClick={handleAddItem} disabled={loadingAdd}>
                        {loadingAdd ? 'Hinzufügen...' : 'Hinzufügen'}
                    </Button>
                </div>
            </div>

            {/* List of Items */}
            <h2 className="text-xl font-medium mb-2">Bestehende {entityNamePlural}</h2>
            <ul className="space-y-2">
                {items.map((item) => (
                    <li key={item.id} className="flex justify-between items-center border p-2 rounded">
                        {editingItemId === item.id ? (
                            <>
                                {renderItemFields(editingItem, setEditingItemField, true)}
                                <div className="flex gap-2">
                                    <Button onClick={handleUpdateItem} disabled={loadingSave}>
                                        {loadingSave ? 'Speichern...' : 'Speichern'}
                                    </Button>
                                    <Button red onClick={() => setEditingItemId(null)} disabled={loadingSave}>
                                        Abbrechen
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <span>{getItemDisplayName(item)}</span>
                                <div className="flex gap-2">
                                    <Button onClick={() => handleEditItem(item)}>Bearbeiten</Button>
                                    <Button
                                        red
                                        onClick={() => handleDeleteItem(item.id)}
                                        disabled={loadingDeleteId === item.id}
                                    >
                                        {loadingDeleteId === item.id ? 'Löschen...' : 'Löschen'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CrudAdminPage;
