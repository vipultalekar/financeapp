import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp,
    writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';

// Collection names
const COLLECTIONS = {
    USERS: 'users',
    TRANSACTIONS: 'transactions',
    BUDGETS: 'budgets',
    GOALS: 'goals',
    CATEGORIES: 'categories',
};

// User Profile
export const createUserProfile = async (userId: string, data: any) => {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await setDoc(userRef, {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
};

export const getUserProfile = async (userId: string) => {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
};

export const updateUserProfile = async (userId: string, data: any) => {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
        ...data,
        updatedAt: Timestamp.now(),
    });
};

// Transactions
export const addTransaction = async (userId: string, transaction: any) => {
    const transactionsRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.TRANSACTIONS);
    const newTransactionRef = doc(transactionsRef);
    await setDoc(newTransactionRef, {
        ...transaction,
        id: newTransactionRef.id,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
    return newTransactionRef.id;
};

export const getTransactions = async (userId: string) => {
    const transactionsRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.TRANSACTIONS);
    const q = query(transactionsRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateTransaction = async (userId: string, transactionId: string, data: any) => {
    const transactionRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.TRANSACTIONS, transactionId);
    await updateDoc(transactionRef, {
        ...data,
        updatedAt: Timestamp.now(),
    });
};

export const deleteTransaction = async (userId: string, transactionId: string) => {
    const transactionRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.TRANSACTIONS, transactionId);
    await deleteDoc(transactionRef);
};

// Budgets
export const addBudget = async (userId: string, budget: any) => {
    const budgetsRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.BUDGETS);
    const newBudgetRef = doc(budgetsRef);
    await setDoc(newBudgetRef, {
        ...budget,
        id: newBudgetRef.id,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
    return newBudgetRef.id;
};

export const getBudgets = async (userId: string) => {
    const budgetsRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.BUDGETS);
    const querySnapshot = await getDocs(budgetsRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateBudget = async (userId: string, budgetId: string, data: any) => {
    const budgetRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.BUDGETS, budgetId);
    await updateDoc(budgetRef, {
        ...data,
        updatedAt: Timestamp.now(),
    });
};

export const deleteBudget = async (userId: string, budgetId: string) => {
    const budgetRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.BUDGETS, budgetId);
    await deleteDoc(budgetRef);
};

// Goals
export const addGoal = async (userId: string, goal: any) => {
    const goalsRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.GOALS);
    const newGoalRef = doc(goalsRef);
    await setDoc(newGoalRef, {
        ...goal,
        id: newGoalRef.id,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
    return newGoalRef.id;
};

export const getGoals = async (userId: string) => {
    const goalsRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.GOALS);
    const querySnapshot = await getDocs(goalsRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateGoal = async (userId: string, goalId: string, data: any) => {
    const goalRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.GOALS, goalId);
    await updateDoc(goalRef, {
        ...data,
        updatedAt: Timestamp.now(),
    });
};

export const deleteGoal = async (userId: string, goalId: string) => {
    const goalRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.GOALS, goalId);
    await deleteDoc(goalRef);
};

// Categories
export const addCategory = async (userId: string, category: any) => {
    const categoriesRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.CATEGORIES);
    const newCategoryRef = doc(categoriesRef);
    await setDoc(newCategoryRef, {
        ...category,
        id: newCategoryRef.id,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
    return newCategoryRef.id;
};

export const getCategories = async (userId: string) => {
    const categoriesRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.CATEGORIES);
    const querySnapshot = await getDocs(categoriesRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateCategory = async (userId: string, categoryId: string, data: any) => {
    const categoryRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.CATEGORIES, categoryId);
    await updateDoc(categoryRef, {
        ...data,
        updatedAt: Timestamp.now(),
    });
};

export const deleteCategory = async (userId: string, categoryId: string) => {
    const categoryRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.CATEGORIES, categoryId);
    await deleteDoc(categoryRef);
};

// Batch operations for syncing local data to cloud
export const syncLocalDataToCloud = async (userId: string, localData: any) => {
    const batch = writeBatch(db);

    // Sync transactions
    if (localData.transactions) {
        localData.transactions.forEach((transaction: any) => {
            const transactionRef = doc(collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.TRANSACTIONS));
            batch.set(transactionRef, {
                ...transaction,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            });
        });
    }

    // Sync budgets
    if (localData.budgets) {
        localData.budgets.forEach((budget: any) => {
            const budgetRef = doc(collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.BUDGETS));
            batch.set(budgetRef, {
                ...budget,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            });
        });
    }

    // Sync goals
    if (localData.goals) {
        localData.goals.forEach((goal: any) => {
            const goalRef = doc(collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.GOALS));
            batch.set(goalRef, {
                ...goal,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            });
        });
    }

    await batch.commit();
};
