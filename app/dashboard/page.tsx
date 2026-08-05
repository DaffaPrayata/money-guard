import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Settings, Plus } from "lucide-react-native";

// Import komponen & lib lokal kamu (sesuaikan relative path jika berbeda)
import { BottomNav } from "../../components/money/bottom-nav";
import { TransactionForm, TransactionFormData } from "../../components/money/transaction-form";
import {
  finance,
  formatRupiah,
  expenseBreakdown,
  MONTH_LABEL,
} from "../../lib/money-data";

export default function DashboardPage() {
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);

  const handleAddTransaction = (data: TransactionFormData) => {
    console.log("New transaction:", data);
    setIsTransactionFormOpen(false);
  };

  const monthlyData = [
    { month: "Jan", income: 4_500_000, expense: 1_200_000 },
    { month: "Feb", income: 5_200_000, expense: 1_400_000 },
    { month: "Mar", income: 4_800_000, expense: 1_300_000 },
    { month: "Apr", income: 5_000_000, expense: 1_500_000 },
    { month: "May", income: 5_000_000, expense: finance.currentExpense },
  ];

  const maxMonthlyVal = 6_000_000;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Home</Text>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => console.log("Pergi ke Profile")}
          >
            <Settings size={20} color="#1a1a1a" />
          </TouchableOpacity>
        </View>

        {/* Total balance */}
        <View style={styles.section}>
          <Text style={styles.subText}>Total balance</Text>
          <Text style={styles.balanceText}>
            {formatRupiah(finance.totalBalance)}
          </Text>
          <Text style={styles.dateLabel}>{MONTH_LABEL}</Text>
        </View>

        {/* Accounts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accounts</Text>
          <View style={styles.gridTwo}>
            <View style={styles.card}>
              <Text style={styles.subText}>Cash</Text>
              <Text style={styles.cardAmount}>Rp 500.000</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.subText}>Bank account</Text>
              <Text style={styles.cardAmount}>Rp 2.000.000</Text>
            </View>
          </View>
        </View>

        {/* Cash flow */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Cash flow</Text>
            <Text style={styles.subText}>{MONTH_LABEL}</Text>
          </View>
          <View style={styles.gridThree}>
            <View>
              <Text style={styles.subText}>Income</Text>
              <Text style={[styles.flowText, { color: "#10b981" }]}>
                {formatRupiah(finance.income)}
              </Text>
            </View>
            <View>
              <Text style={styles.subText}>Expenses</Text>
              <Text style={[styles.flowText, { color: "#ef4444" }]}>
                {formatRupiah(finance.currentExpense)}
              </Text>
            </View>
            <View>
              <Text style={styles.subText}>Total</Text>
              <Text style={styles.flowText}>
                {formatRupiah(finance.income - finance.currentExpense)}
              </Text>
            </View>
          </View>
        </View>

        {/* Spending by Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending by Category</Text>
          <View style={{ marginTop: 8 }}>
            {expenseBreakdown.map((item) => (
              <View key={item.name} style={styles.categoryRow}>
                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                <Text style={styles.categoryName}>{item.name}</Text>
                <Text style={styles.categoryAmount}>{formatRupiah(item.amount)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Monthly Trend - Native Bar Chart */}
        <View style={[styles.section, { borderBottomWidth: 0 }]}>
          <Text style={styles.sectionTitle}>Monthly trend</Text>
          <View style={styles.chartContainer}>
            {monthlyData.map((item) => {
              const incomeHeight = (item.income / maxMonthlyVal) * 120;
              const expenseHeight = (item.expense / maxMonthlyVal) * 120;

              return (
                <View key={item.month} style={styles.barGroup}>
                  <View style={styles.barsArea}>
                    <View
                      style={[
                        styles.bar,
                        { height: incomeHeight, backgroundColor: "#10b981" },
                      ]}
                    />
                    <View
                      style={[
                        styles.bar,
                        { height: expenseHeight, backgroundColor: "#ef4444" },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{item.month}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsTransactionFormOpen(true)}
        activeOpacity={0.8}
      >
        <Plus size={26} color="#ffffff" strokeWidth={2.5} />
      </TouchableOpacity>

      {/* Modal Transaction Form */}
      <TransactionForm
        isOpen={isTransactionFormOpen}
        onClose={() => setIsTransactionFormOpen(false)}
        onSubmit={handleAddTransaction}
      />

      {/* Bottom Navigation */}
      <BottomNav active="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  iconButton: {
    padding: 4,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  subText: {
    fontSize: 12,
    color: "#737373",
  },
  balanceText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#1a1a1a",
    marginTop: 4,
  },
  dateLabel: {
    fontSize: 12,
    color: "#737373",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  gridTwo: {
    flexDirection: "row",
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginTop: 4,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gridThree: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  flowText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginTop: 2,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 12,
    color: "#737373",
  },
  categoryAmount: {
    fontSize: 12,
    color: "#1a1a1a",
    marginLeft: "auto",
    fontWeight: "500",
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 150,
    marginTop: 12,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  barGroup: {
    alignItems: "center",
  },
  barsArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  bar: {
    width: 12,
    borderRadius: 2,
  },
  barLabel: {
    fontSize: 11,
    color: "#737373",
    marginTop: 6,
  },
  fab: {
    position: "absolute",
    bottom: 80,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1e3a5f",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});