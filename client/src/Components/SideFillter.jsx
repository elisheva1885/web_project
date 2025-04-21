import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Slider } from 'primereact/slider';
import { useSelector } from 'react-redux';

const SideFilter = () => {
    const [visible, setVisible] = useState(true);

    const [openSections, setOpenSections] = useState({
        company: false,
        shabbat: false,
        wifi: false,
        price: false,
        btuHeating: false,
        btuCooling: false,
        energy: false,
    });

    const toggleSection = (key) => {
        setOpenSections((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const [selectedOptions, setSelectedOptions] = useState([]);
    const [shabbatMode, setShabbatMode] = useState(false);
    const [wifi, setWifi] = useState(false);
    const [priceRange, setPriceRange] = useState([100, 1000]);
    const [btuHeating, setBtuHeating] = useState(9500);
    const [btuCooling, setBtuCooling] = useState(9500);
    const [energyRating, setEnergyRating] = useState('');

    const { companies } = useSelector((state) => state.companies);
    const options = companies.map(company => company.name);

    const toggleOption = (option) => {
        setSelectedOptions((prev) =>
            prev.includes(option)
                ? prev.filter((item) => item !== option)
                : [...prev, option]
        );
    };

    return (
        <div className="card flex justify-content-center">
            <Sidebar
                visible={visible}
                onHide={() => setVisible(false)}
                content={({ closeIconRef, hide }) => (
                    <div className="min-h-screen flex relative lg:static surface-ground">
                        <div
                            id="app-sidebar-2"
                            className="surface-section h-screen block flex-shrink-0 fixed left-0 top-0 z-1 border-right-1 surface-border select-none"
                            style={{ width: '280px' }}
                        >
                            <div className="flex flex-column h-full">
                                <div className="flex align-items-center justify-content-between px-4 pt-3 flex-shrink-0">
                                    <span className="inline-flex align-items-center gap-2">
                                        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" />
                                    </span>
                                    <span>
                                        <Button
                                            type="button"
                                            ref={closeIconRef}
                                            onClick={(e) => hide(e)}
                                            icon="pi pi-times"
                                            rounded
                                            outlined
                                            className="h-2rem w-2rem"
                                        />
                                    </span>
                                </div>

                                <div className="overflow-y-auto px-3">
                                    <ul className="list-none p-0 m-0">

                                        {/* סינון לפי חברה */}
                                        <li className="mb-4">
                                            <button
                                                onClick={() => toggleSection('company')}
                                                className="w-full text-right font-medium text-lg text-primary hover:underline"
                                            >
                                                סינון לפי חברה
                                            </button>
                                            {openSections.company && (
                                                <div className="mt-2 pl-2 text-right">
                                                    {options.map((option) => (
                                                        <label key={option} className="block mb-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedOptions.includes(option)}
                                                                onChange={() => toggleOption(option)}
                                                                className="ml-2"
                                                            />
                                                            {option}
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </li>

                                        {/* מצב שבת */}
                                        <li className="mb-4">
                                            <button
                                                onClick={() => toggleSection('shabbat')}
                                                className="w-full text-right font-medium text-lg text-primary hover:underline"
                                            >
                                                מצב שבת
                                            </button>
                                            {openSections.shabbat && (
                                                <div className="mt-2 pl-2 text-right">
                                                    <label className="block mb-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={shabbatMode}
                                                            onChange={(e) => setShabbatMode(e.target.checked)}
                                                            className="ml-2"
                                                        />
                                                        מופעל
                                                    </label>
                                                </div>
                                            )}
                                        </li>

                                        {/* WiFi */}
                                        <li className="mb-4">
                                            <button
                                                onClick={() => toggleSection('wifi')}
                                                className="w-full text-right font-medium text-lg text-primary hover:underline"
                                            >
                                                WiFi
                                            </button>
                                            {openSections.wifi && (
                                                <div className="mt-2 pl-2 text-right">
                                                    <label className="block mb-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={wifi}
                                                            onChange={(e) => setWifi(e.target.checked)}
                                                            className="ml-2"
                                                        />
                                                        קיים
                                                    </label>
                                                </div>
                                            )}
                                        </li>

                                        {/* טווח מחיר */}
                                        <li className="mb-4">
                                            <button
                                                onClick={() => toggleSection('price')}
                                                className="w-full text-right font-medium text-lg text-primary hover:underline"
                                            >
                                                סינון לפי מחיר
                                            </button>
                                            {openSections.price && (
                                                <div className="mt-2 text-right">
                                                    <Slider
                                                        value={priceRange}
                                                        onChange={(e) => setPriceRange(e.value)}
                                                        range
                                                        min={0}
                                                        max={2000}
                                                        step={50}
                                                    />
                                                    <div className="mt-2 text-sm text-gray-700">
                                                        ₪{priceRange[0]} - ₪{priceRange[1]}
                                                    </div>
                                                </div>
                                            )}
                                        </li>

                                        {/* BTU חימום */}
                                        <li className="mb-4">
                                            <button
                                                onClick={() => toggleSection('btuHeating')}
                                                className="w-full text-right font-medium text-lg text-primary hover:underline"
                                            >
                                                BTU חימום (מ-)
                                            </button>
                                            {openSections.btuHeating && (
                                                <div className="mt-2 text-right">
                                                    <Slider
                                                        value={btuHeating}
                                                        onChange={(e) => setBtuHeating(e.value)}
                                                        min={9500}
                                                        max={40000}
                                                        step={500}
                                                    />
                                                    <div className="mt-2 text-sm text-gray-700">מ־ {btuHeating} BTU</div>
                                                </div>
                                            )}
                                        </li>

                                        {/* BTU קירור */}
                                        <li className="mb-4">
                                            <button
                                                onClick={() => toggleSection('btuCooling')}
                                                className="w-full text-right font-medium text-lg text-primary hover:underline"
                                            >
                                                BTU קירור (מ-)
                                            </button>
                                            {openSections.btuCooling && (
                                                <div className="mt-2 text-right">
                                                    <Slider
                                                        value={btuCooling}
                                                        onChange={(e) => setBtuCooling(e.value)}
                                                        min={9500}
                                                        max={40000}
                                                        step={500}
                                                    />
                                                    <div className="mt-2 text-sm text-gray-700">מ־ {btuCooling} BTU</div>
                                                </div>
                                            )}
                                        </li>

                                        {/* דירוג אנרגטי */}
                                        <li className="mb-4">
                                            <button
                                                onClick={() => toggleSection('energy')}
                                                className="w-full text-right font-medium text-lg text-primary hover:underline"
                                            >
                                                דירוג אנרגטי
                                            </button>
                                            {openSections.energy && (
                                                <div className="mt-2 text-right">
                                                    {['A', 'A+', 'A++'].map((rating) => (
                                                        <label key={rating} className="block mb-2">
                                                            <input
                                                                type="radio"
                                                                name="energyRating"
                                                                value={rating}
                                                                checked={energyRating === rating}
                                                                onChange={() => setEnergyRating(rating)}
                                                                className="ml-2"
                                                            />
                                                            {rating}
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </li>
                                    </ul>
                                </div>

                                <div className="mt-auto p-3">
                                    <Button className="w-full" label="סנן תוצאות" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default SideFilter;
