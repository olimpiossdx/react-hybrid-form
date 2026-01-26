import React from 'react';

import TabEmployeeDashboard from './employee-dashboard';
import FileExample from './file-input';
import TabGraphExample from './graph-event-bus';
import ListPatternsExample from './list-patterns';
import TabAlertExample from './tab-alert';
import TabAsyncAutocompleteExample from './tab-autocomplete';
import TabBadge from './tab-badge';
import BudgetProjectForm from './tab-budget-project-form';
import TabButtonExample from './tab-button';
import TabCard from './tab-card';
import CheckboxGroupForm from './tab-checkbox-group-form';
import CurriculumForm from './tab-curriculum';
import TabDataTableExample from './tab-data-table';
import HybridFormSimple from './tab-hibryd-form-simple';
import TabInputTypes from './tab-input';
import LoginForm from './tab-login';
import TabMaskExample from './tab-mask';
import TabModal from './tab-modal';
import NestedListForm from './tab-nested-list-form';
import TabPagination from './tab-pagination';
import TabRadioGroup from './tab-radio-group';
import DateRangeExample from './tab-range-date';
import TabStarRatingExample from './tab-rating';
import RegistrationComplexExample from './tab-registration';
import RegistrationForm from './tab-registration-form';
import TabTableScrollCRUD from './tab-scroll-crud';
import TabSelect from './tab-select';
import TabServiceExample from './tab-service';
import TabSpinner from './tab-spinner';
import TabSwitchExample from './tab-switch';
import TabTable from './tab-table';
import TabTableCollapse from './tab-table-collapse';
import TabTableComplexo from './tab-table-complexo';
import TabTableResponsiveAll from './tab-table-responsive-all';
import TabTableStackCRUD from './tab-table-stack-crud';
import TabTextArea from './tab-textarea';
import ToastContainerExample from './tab-toast-container';
import TabTransferList from './tab-transferlist';
import ValidationFeedbackExample from './tab-validacao';
import TabValidationComplexExample from './tab-validation-complex';
import TabVirtualList from './tab-virtualize';
import TabWizard from './tab-wizard-tabs';
import Box from '../../componentes/box';
import Flex from '../../componentes/flex';
import NestedLevelForm from '../../componentes/nested-level-form';
import TabButton from '../../componentes/tab-button';
import ThemeToggle from '../../componentes/theme';
import ListTestPage from '../tab-use-list';

const Homologacao: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('curriculum');

  const scenarios: Record<string, React.ReactNode> = {
    login: <LoginForm />,
    registration: <RegistrationForm />,
    hybrid: <HybridFormSimple />,
    nestedList: <NestedListForm />,
    curriculum: <CurriculumForm />,
    checkboxGroup: <CheckboxGroupForm />,
    tabModal: <TabModal />,
    nestedLevelForm: <NestedLevelForm />,
    starRatingExample: <TabStarRatingExample />,
    asyncAutocompleteExample: <TabAsyncAutocompleteExample />,
    validationFeedbackExample: <ValidationFeedbackExample />,
    registrationComplexExample: <RegistrationComplexExample />,
    budgetProjectForm: <BudgetProjectForm />,
    toastContainerExample: <ToastContainerExample />,
    tabAlertExample: <TabAlertExample />,
    tabSwitchExample: <TabSwitchExample />,
    dateRangeExample: <DateRangeExample />,
    tabServiceExample: <TabServiceExample />,
    tabEmployeeDashboard: <TabEmployeeDashboard />,
    tabGraphExample: <TabGraphExample />,
    tabEventBusForm: <ListPatternsExample />,
    tabVirtualList: <TabVirtualList />,
    tabMaskExample: <TabMaskExample />,
    inputfile: <FileExample />,
    tabValidationComplexExample: <TabValidationComplexExample />,
    tabWizard: <TabWizard />,
    tabDataTableExample: <TabDataTableExample />,
    tabTableScroll: <TabTableScrollCRUD />,
    tabTableStackCRUD: <TabTableStackCRUD />,
    tabTableCollapse: <TabTableCollapse />,
    tabPagination: <TabPagination />,
    tabTransferList: <TabTransferList />,
    tabTextArea: <TabTextArea />,
    tabRadioGroup: <TabRadioGroup />,
    tabButtonExample: <TabButtonExample />,
    tabInputTypes: <TabInputTypes />,
    tabSelect: <TabSelect />,
    tabSpinner: <TabSpinner />,
    tabCard: <TabCard />,
    tabBadge: <TabBadge />,
    tabTable: <TabTable />,
    tabTableComplexo: <TabTableComplexo />,
    tabTableResponsiveAll: <TabTableResponsiveAll />,
    listTestPage: <ListTestPage />,
  };

  return (
    <Box className="min-h-screen p-2 sm:p-4 font-sans transition-colors duration-300 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
      <Box className="max-w-8xl mx-auto">
        {/* HEADER com Toggle */}
        <Flex
          as="header"
          direction="col"
          gap={4}
          align="center"
          justify="between"
          className="mb-8 md:flex-row border-b border-gray-200 dark:border-gray-700 pb-6">
          <Box className="text-center md:text-left">
            <h1 className="text-xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500">
              useForm - v0.6.2
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Ambiente de Homologação</p>
          </Box>

          <Flex align="center" gap={4}>
            <ThemeToggle />
          </Flex>
        </Flex>

        {/* NAVEGAÇÃO: Card branco no light, cinza no dark */}
        <Flex
          justify="center"
          wrap
          gap={2}
          className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          {/* Grupo 1: Core */}
          <TabButton tabId="login" label="Login (Nativo)" isActive={activeTab === 'login'} onClick={setActiveTab} />
          <TabButton tabId="registration" label="Registro" isActive={activeTab === 'registration'} onClick={setActiveTab} />
          <TabButton tabId="hybrid" label="Híbrido" isActive={activeTab === 'hybrid'} onClick={setActiveTab} />

          <Box className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Grupo 2: Listas & Dados */}
          <TabButton tabId="nestedList" label="Listas" isActive={activeTab === 'nestedList'} onClick={setActiveTab} />
          <TabButton tabId="curriculum" label="Currículo" isActive={activeTab === 'curriculum'} onClick={setActiveTab} />
          <TabButton tabId="budgetProjectForm" label="Orçamento" isActive={activeTab === 'budgetProjectForm'} onClick={setActiveTab} />
          <TabButton tabId="tabVirtualList" label="Virtual List (500k)" isActive={activeTab === 'tabVirtualList'} onClick={setActiveTab} />
          <TabButton tabId="tabEventBusForm" label="List Patterns" isActive={activeTab === 'tabEventBusForm'} onClick={setActiveTab} />
          <TabButton tabId="listTestPage" label="use list-atualizado" isActive={activeTab === 'listTestPage'} onClick={setActiveTab} />

          <Box className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Grupo 3: Componentes */}
          <TabButton tabId="checkboxGroup" label="Checkboxes" isActive={activeTab === 'checkboxGroup'} onClick={setActiveTab} />
          <TabButton tabId="starRatingExample" label="Rating" isActive={activeTab === 'starRatingExample'} onClick={setActiveTab} />
          <TabButton
            tabId="asyncAutocompleteExample"
            label="Autocomplete"
            isActive={activeTab === 'asyncAutocompleteExample'}
            onClick={setActiveTab}
          />
          <TabButton tabId="tabSwitchExample" label="Switch" isActive={activeTab === 'tabSwitchExample'} onClick={setActiveTab} />
          <TabButton tabId="tabTransferList" label="Transfer List" isActive={activeTab === 'tabTransferList'} onClick={setActiveTab} />
          <TabButton tabId="dateRangeExample" label="Date Range" isActive={activeTab === 'dateRangeExample'} onClick={setActiveTab} />
          <TabButton tabId="tabMaskExample" label="Masks" isActive={activeTab === 'tabMaskExample'} onClick={setActiveTab} />
          <TabButton tabId="nestedLevelForm" label="Fractal" isActive={activeTab === 'nestedLevelForm'} onClick={setActiveTab} />
          <TabButton tabId="inputfile" label="Input file" isActive={activeTab === 'inputfile'} onClick={setActiveTab} />
          <TabButton tabId="tabWizard" label="Wizard tabs" isActive={activeTab === 'tabWizard'} onClick={setActiveTab} />
          <TabButton
            tabId="tabDataTableExample"
            label="Gestão de Usuários (data-table)"
            isActive={activeTab === 'tabDataTableExample'}
            onClick={setActiveTab}
          />
          <TabButton tabId="tabTableScroll" label="Table (Inline)" isActive={activeTab === 'tabTableScroll'} onClick={setActiveTab} />
          <TabButton
            tabId="tabTableStackCRUD"
            label="Table (Mobile Card)"
            isActive={activeTab === 'tabTableStackCRUD'}
            onClick={setActiveTab}
          />
          <TabButton
            tabId="tabTableCollapse"
            label="Table (Mobile collapse)"
            isActive={activeTab === 'tabTableCollapse'}
            onClick={setActiveTab}
          />
          <TabButton tabId="tabPagination" label="Paginação" isActive={activeTab === 'tabPagination'} onClick={setActiveTab} />
          <TabButton tabId="tabTextArea" label="TextArea" isActive={activeTab === 'tabTextArea'} onClick={setActiveTab} />
          <TabButton tabId="tabRadioGroup" label="Radio Group" isActive={activeTab === 'tabRadioGroup'} onClick={setActiveTab} />
          <TabButton tabId="tabButtonExample" label="Button" isActive={activeTab === 'tabButtonExample'} onClick={setActiveTab} />
          <TabButton tabId="tabInputTypes" label="Input Types" isActive={activeTab === 'tabInputTypes'} onClick={setActiveTab} />
          <TabButton tabId="tabSelect" label="Select" isActive={activeTab === 'tabSelect'} onClick={setActiveTab} />
          <TabButton tabId="tabSpinner" label="Spinner" isActive={activeTab === 'tabSpinner'} onClick={setActiveTab} />
          <TabButton tabId="tabCard" label="Card" isActive={activeTab === 'tabCard'} onClick={setActiveTab} />
          <TabButton tabId="tabBadge" label="Badge" isActive={activeTab === 'tabBadge'} onClick={setActiveTab} />
          <TabButton tabId="tabTable" label="Table" isActive={activeTab === 'tabTable'} onClick={setActiveTab} />
          <TabButton tabId="tabTableComplexo" label="Table Complexo" isActive={activeTab === 'tabTableComplexo'} onClick={setActiveTab} />
          <TabButton
            tabId="tabTableResponsiveAll"
            label="Table Responsivo"
            isActive={activeTab === 'tabTableResponsiveAll'}
            onClick={setActiveTab}
          />

          <Box className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Grupo 4: Sistema */}
          <TabButton tabId="tabModal" label="Modais" isActive={activeTab === 'tabModal'} onClick={setActiveTab} />
          <TabButton tabId="toastContainerExample" label="Toasts" isActive={activeTab === 'toastContainerExample'} onClick={setActiveTab} />
          <TabButton tabId="tabAlertExample" label="Alerts" isActive={activeTab === 'tabAlertExample'} onClick={setActiveTab} />
          <TabButton
            tabId="validationFeedbackExample"
            label="Validação UX"
            isActive={activeTab === 'validationFeedbackExample'}
            onClick={setActiveTab}
          />
          <TabButton
            tabId="tabValidationComplexExample"
            label="Validação api validator"
            isActive={activeTab === 'tabValidationComplexExample'}
            onClick={setActiveTab}
          />
          <TabButton
            tabId="registrationComplexExample"
            label="Validação Mista"
            isActive={activeTab === 'registrationComplexExample'}
            onClick={setActiveTab}
          />

          <Box className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Grupo 5: Infraestrutura */}
          <TabButton tabId="tabServiceExample" label="HTTP Service" isActive={activeTab === 'tabServiceExample'} onClick={setActiveTab} />
          <TabButton
            tabId="tabEmployeeDashboard"
            label="Dashboard"
            isActive={activeTab === 'tabEmployeeDashboard'}
            onClick={setActiveTab}
          />
          <TabButton tabId="tabGraphExample" label="Event Bus" isActive={activeTab === 'tabGraphExample'} onClick={setActiveTab} />
        </Flex>

        {/* ÁREA DE RENDERIZAÇÃO */}
        <Box as="main" className="transition-opacity duration-300 ease-in-out border-t border-gray-200 dark:border-gray-700 pt-6">
          {scenarios[activeTab] || <Box className="text-center text-gray-500">Cenário não encontrado.</Box>}
        </Box>
      </Box>
    </Box>
  );
};

export default Homologacao;
