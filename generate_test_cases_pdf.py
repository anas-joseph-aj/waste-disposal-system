from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer


def build_pdf(output_path: str) -> None:
    doc = SimpleDocTemplate(
        output_path,
        pagesize=landscape(A4),
        leftMargin=24,
        rightMargin=24,
        topMargin=24,
        bottomMargin=24,
    )

    styles = getSampleStyleSheet()
    story = []

    title = Paragraph("Waste Disposal System - Test Cases", styles["Title"])
    story.append(title)
    story.append(Spacer(1, 12))

    data = [
        ["Test ID", "Test Scenario Name", "Test Data", "Expected Result", "Actual Result", "Test Status"],
        ["T1", "User Login", "Email: invalid, Password: invalid", "Error message: Incorrect credentials", "Pending execution", "Not Run"],
        ["T2", "User Login", "Email: valid, Password: invalid", "Error message: Incorrect credentials", "Pending execution", "Not Run"],
        ["T3", "User Login", "Email: invalid, Password: valid", "Error message: Incorrect credentials", "Pending execution", "Not Run"],
        ["T4", "User Login", "Email: valid, Password: valid", "User redirected to User Dashboard", "Pending execution", "Not Run"],
        ["T5", "Registration", "Empty required fields", "Validation error shown", "Pending execution", "Not Run"],
        ["T6", "Registration", "Existing email", "Error: account already exists", "Pending execution", "Not Run"],
        ["T7", "Registration", "Password length < 8", "Error: password must be at least 8 chars", "Pending execution", "Not Run"],
        ["T8", "Registration", "Valid new user data", "Registration successful, account created", "Pending execution", "Not Run"],
        ["T9", "Pickup Request", "Date/time in past", "Error: only upcoming date/time allowed", "Pending execution", "Not Run"],
        ["T10", "Pickup Request", "Valid waste type, date, address, no image", "Request submitted successfully", "Pending execution", "Not Run"],
        ["T11", "Pickup Request", "Valid data with image upload", "Request submitted with image attached", "Pending execution", "Not Run"],
        ["T12", "Pickup to Payment Flow", "Submit pickup request", "Payment panel opens immediately", "Pending execution", "Not Run"],
        ["T13", "Payment Submission", "No payment method selected", "Error: choose payment method", "Pending execution", "Not Run"],
        ["T14", "Payment Submission", "Valid amount + valid method", "Payment successful, record added to history", "Pending execution", "Not Run"],
        ["T15", "Profile Update", "Change name/phone/address/email", "Profile updated successfully", "Pending execution", "Not Run"],
        ["T16", "Change Password", "New and confirm mismatch", "Error: passwords do not match", "Pending execution", "Not Run"],
        ["T17", "Change Password", "Valid current + valid new password", "Password changed successfully", "Pending execution", "Not Run"],
        ["T18", "Collector View Routes", "Collector login", "Assigned routes list displayed", "Pending execution", "Not Run"],
        ["T19", "Collector Status Update", "Update status to In-Progress/Completed", "Status updated and visible in user tracking", "Pending execution", "Not Run"],
        ["T20", "Collector Proof Upload", "Upload completion proof image", "Proof saved and visible in request history", "Pending execution", "Not Run"],
    ]

    table = Table(
        data,
        repeatRows=1,
        colWidths=[52, 128, 212, 185, 145, 72],
    )

    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2f6f3e")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#9aa8a0")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#f7faf8"), colors.white]),
                ("LEFTPADDING", (0, 0), (-1, -1), 4),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )

    story.append(table)
    doc.build(story)


if __name__ == "__main__":
    build_pdf("test-cases.pdf")
