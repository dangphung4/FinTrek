import React, {useState, useEffect} from 'react';
//chakra ui imports
import { 
    Box, 
    SimpleGrid, 
    Progress, 
    Text, 
    VStack, 
    useColorModeValue, 
    Button, 
    Flex, 
    Modal, 
    ModalOverlay, 
    ModalContent, 
    ModalHeader, 
    ModalFooter, 
    ModalBody, 
    ModalCloseButton 
} from '@chakra-ui/react';
//faker import for fake data
import { faker } from '@faker-js/faker';
//icon imports
import { 
    FaPlus, 
    FaChartBar, 
    FaRegEdit 
} from 'react-icons/fa';
//context import for budget details
import { useBudget } from '../context/budgetContext';
//component imports (sorted alphabetically)
import AddCategoryModal from '../components/AddCategoryModal';
import BudgetCategoryCard from '../components/BudgetCategoryCard';
import BudgetWindowSelect from '../components/BudgetWindowSelect';
import DashboardCard from '../components/DashboardCard';
import EditTotalBudget from '../components/EditTotalBudget';
import ModalCategoryBudgetSlider from '../components/ModalCategoryBudgetSlider';
import PageHeader from '../components/PageHeader';
//supabase client import necessary for giving sb access token to backend
import supabase from '../supabaseClient';

const categories = ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Shopping'];

function Budget() {
  const bgColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  const [budgetWindow, setBudgetWindow] = useState('Year');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {setAllocatedBudget, totalBudget, categoryToBudgetDictionary, setCategoryToBudgetDictionary, newCategoryAdded} = useBudget();

  const [potentialTotalBudget, setPotentialTotalBudget] = useState(totalBudget.toString());

  //variable necessary for holding open/closed state of the add category modal
  const [isOpenAddCategoryModal, setIsOpenAddCategoryModal] = useState(false);

  //call to rest api to get budget details
  useEffect(() => {
      const getBudgetDetailsCall = async () => {
          const sbAccessToken = localStorage.getItem('sb_access_token');
          const { data: { user } } = await supabase.auth.getUser();
          const userID = user?.id || '';
          const response = await fetch(`${import.meta.env.VITE_API_URL}/get_budget_details`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ userID, sbAccessToken }),
          });
    
          const data = await response.json();
    
          if (!response.ok) {
              console.log("Could not find budget details for user: ", data.message);
              setCategoryToBudgetDictionary(null);
              return;
          }
    
          console.log("Found budget details for user: ", data.budgetDetails);
          setCategoryToBudgetDictionary(data.budgetDetails);
      };
    
      getBudgetDetailsCall();
  }, [newCategoryAdded]); //only executes when a new category gets added to the database to reduce calls

  const handleEditButtonClick = () => {
      setIsEditModalOpen(true);

  };

  const handleCloseModal = () => {
      setIsEditModalOpen(false);  // close the modal (duh)
      setAllocatedBudget(0); // make sure the allocated budget gets reset so upon trying to edit again it doesn't lock u at 0 for the sliders
      // in the future will need to not set allocated budget to 0 but set it whatever it was before according to the database
      // will also need a way of resetting each slider to their original values, probably with context and a new useEffect (within the slider component) with something from the context in the dependency array
      setPotentialTotalBudget(totalBudget.toString());
  };

  const handleApplyChanges = () => {
      //will add functionality to this later
      //probably will involve sending new values for budget allocation amounts for different categories
      //to endpoint that then makes appropriate changes in the database
  };

  const handleBudgetChange = (e) => {
      const value = Math.floor(Number(e.target.value))

      // Only update budget if value is a positive integer
      if (/^\d*$/.test(value) && Number(value) > 0) {
          setPotentialTotalBudget(e.target.value);
      }else{
          setPotentialTotalBudget('');
      }
  };

  return (
    <Box width="100%">
      <PageHeader title="Budget" />
      <BudgetWindowSelect 
          onWindowChange = {setBudgetWindow}
      />
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <DashboardCard
          title="Total Budget"
          value={`$${faker.number.int({ min: 2000, max: 10000 })}`}
          change="5.2%"
          isIncrease={true}
          icon={FaChartBar}
        />
        <DashboardCard
          title="Spent so far"
          value={`$${faker.number.int({ min: 1000, max: 5000 })}`}
          change="45%"
          isIncrease={false}
          icon={FaChartBar}
        />
        <DashboardCard
          title="Remaining"
          value={`$${faker.number.int({ min: 500, max: 5000 })}`}
          change="55%"
          isIncrease={true}
          icon={FaChartBar}
        />
      </SimpleGrid>
      <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="sm">
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontSize="xl" fontWeight="bold">Budget Breakdown</Text>
          <Box>
            <Button leftIcon={<FaRegEdit />} colorScheme="blue" width={{base:'43px', megasmall:'auto'}} mr={3} onClick={handleEditButtonClick}>Edit</Button>
            <Button leftIcon={<FaPlus />} colorScheme="blue" width={{base:'86px',megasmall:'auto'}} onClick={() => {setIsOpenAddCategoryModal(true)}}>Add Category</Button>
          </Box>
        </Flex>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {categoryToBudgetDictionary ? (categoryToBudgetDictionary.map(object => {
            const spent = faker.number.int({ min: 100, max: 500 });

            return(
              <BudgetCategoryCard
                key={object.category} 
                budget={object.budget}
                spent={spent}
                category={object.category}
              />
            );
          })) : ({})}
        </SimpleGrid>
      </Box>
      {/* modal for editing budgets (I will probably make this its own component down the line) */}
      <Modal isOpen={isEditModalOpen} onClose={handleCloseModal} size="2xl" isCentered>
          <ModalOverlay />
          <ModalContent>
              <ModalHeader textAlign={"center"}>{`${budgetWindow}ly Budget`}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                  <EditTotalBudget 
                      handleBudgetChange={handleBudgetChange}
                      potentialTotalBudget={potentialTotalBudget}    
                  />
                  {/* I will add self-balancing sliders here for each category */}
                  <ModalCategoryBudgetSlider  category='Eating Out' />
                  <ModalCategoryBudgetSlider  category='Groceries' />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button colorScheme="blue" onClick={handleApplyChanges}>
                  Apply
                </Button>
              </ModalFooter>
          </ModalContent>
      </Modal>

      <AddCategoryModal 
          isOpenAddCategoryModal={isOpenAddCategoryModal}
          setIsOpenAddCategoryModal={setIsOpenAddCategoryModal}    
      />
    </Box>
  );
}

export default Budget;