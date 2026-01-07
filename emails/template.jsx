import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";

export default function EmailTemplate({
  userName = "Prem Dhawan",
  type = "monthly-report",
  data = {
      month: "October",
      stats: {
        totalIncome: 12000,
        totalExpenses: 10976,
        byCategory: {
          housing: 4883,
          groceries: 50,
          transportation: 198,
          travel: 3791,
          entertainment: 741,
          utilities: 172,
        },
      },
      insights: [
        "Your housing expenses are 43% of your total spending - consider reviewing your housing costs.",
        "Great job keeping entertainment expenses under control this month!",
        "Setting up automatic savings could help you save 20% more of your income.",
      ],
    },
}) {
  const safeStats = data?.stats || {
    totalIncome: 0,
    totalExpenses: 0,
    byCategory: {},
  };

  const net = safeStats.totalIncome - safeStats.totalExpenses;

  if (type === "monthly-report") {
    return (
      <Html>
        <Head />
        <Preview>Your Monthly Financial Report</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Monthly Financial Report</Heading>

            <Text style={styles.text}>Hello {userName},</Text>
            <Text style={styles.text}>
              Here’s your financial summary for {data?.month || "this month"}:
            </Text>

            {/* Main Stats */}
            <Section style={styles.statsContainer}>
              <Row>
                <Column>
                  <Text style={styles.text}>Total Income</Text>
                  <Text style={styles.heading}>${safeStats.totalIncome}</Text>
                </Column>
              </Row>

              <Row>
                <Column>
                  <Text style={styles.text}>Total Expenses</Text>
                  <Text style={styles.heading}>${safeStats.totalExpenses}</Text>
                </Column>
              </Row>

              <Row>
                <Column>
                  <Text style={styles.text}>Net</Text>
                  <Text style={styles.heading}>${net}</Text>
                </Column>
              </Row>
            </Section>

            {/* Category Breakdown */}
            {safeStats.byCategory && (
              <Section style={styles.section}>
                <Heading style={styles.heading}>Expenses by Category</Heading>
                {Object.entries(safeStats.byCategory).map(
                  ([category, amount]) => (
                    <Row key={category} style={styles.row}>
                      <Column>
                        <Text style={styles.text}>{category}</Text>
                      </Column>
                      <Column>
                        <Text style={styles.text}>${amount}</Text>
                      </Column>
                    </Row>
                  )
                )}
              </Section>
            )}

            {/* AI Insights */}
            {data?.insights?.length > 0 && (
              <Section style={styles.section}>
                <Heading style={styles.heading}>Welth Insights</Heading>
                {data.insights.map((insight, index) => (
                  <Text key={index} style={styles.text}>
                    • {insight}
                  </Text>
                ))}
              </Section>
            )}

            <Text style={styles.footer}>
              Thank you for using Welth. Keep tracking your finances for better
              financial health!
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }

  // Budget Alert Email
  if (type === "budget-alert") {
    const percentageUsed = data?.percentageUsed || 0;

    return (
      <Html>
        <Head />
        <Preview>Budget Alert</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Budget Alert</Heading>
            <Text style={styles.text}>Hello {userName},</Text>

            <Text style={styles.text}>
              You’ve used {percentageUsed.toFixed(1)}% of your monthly budget.
            </Text>

            <Section style={styles.statsContainer}>
              <Row>
                <Column>
                  <Text style={styles.text}>Budget Amount</Text>
                  <Text style={styles.heading}>${data?.budgetAmount || 0}</Text>
                </Column>
              </Row>

              <Row>
                <Column>
                  <Text style={styles.text}>Spent So Far</Text>
                  <Text style={styles.heading}>
                    ${data?.totalExpenses || 0}
                  </Text>
                </Column>
              </Row>

              <Row>
                <Column>
                  <Text style={styles.text}>Remaining</Text>
                  <Text style={styles.heading}>
                    ${(data?.budgetAmount || 0) - (data?.totalExpenses || 0)}
                  </Text>
                </Column>
              </Row>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }
}

// same styles
const styles = {
  body: {
    backgroundColor: "#f6f9fc",
    fontFamily: "-apple-system, sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  title: {
    color: "#1f2937",
    fontSize: "32px",
    fontWeight: "bold",
    textAlign: "center",
    margin: "0 0 20px",
  },
  heading: {
    color: "#1f2937",
    fontSize: "20px",
    fontWeight: "600",
    margin: "0 0 16px",
  },
  text: {
    color: "#4b5563",
    fontSize: "16px",
    margin: "0 0 16px",
  },
  section: {
    marginTop: "32px",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "5px",
  },
  statsContainer: {
    margin: "32px 0",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "5px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  footer: {
    color: "#6b7280",
    fontSize: "14px",
    textAlign: "center",
    marginTop: "32px",
  },
};
