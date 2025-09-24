from datetime import datetime, timezone
from werkzeug.security import generate_password_hash
from Config import db, app
from Models import User, Cohort, Project, Vote

def seed():
    print("🌱 Seeding database...")

    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()

        # Create cohorts
        cohort1 = Cohort(name="Cohort 1")
        cohort2 = Cohort(name="Cohort 2")
        db.session.add_all([cohort1, cohort2])
        db.session.commit()

        # Create users
        student1 = User(
            username="student1",
            email="student1@example.com",
            role="student",
            cohort=cohort1
        )
        student1.set_password("password123")

        student2 = User(
            username="student2",
            email="student2@example.com",
            role="student",
            cohort=cohort1
        )
        student2.set_password("password123")

        mentor1 = User(
            username="mentor1",
            email="mentor1@example.com",
            role="mentor",
            cohort=cohort2
        )
        mentor1.set_password("password123")

        db.session.add_all([student1, student2, mentor1])
        db.session.commit()

        # Create projects (using user_id to avoid warnings)
        project1 = Project(
            title="AI Chatbot",
            description="A chatbot powered by AI that can assist students with FAQs. " * 2,
            user_id=student1.id,
            author_name=student1.username,
            status="pending"
        )

        project2 = Project(
            title="E-learning Platform",
            description="A platform where students can take courses and interact with mentors. " * 2,
            user_id=student2.id,
            author_name=student2.username,
            status="pending"
        )

        db.session.add_all([project1, project2])
        db.session.commit()

        # Create votes
        vote1 = Vote(
            status="approved",
            mentor_id=mentor1.id,
            project_id=project1.id
        )
        vote2 = Vote(
            status="declined",
            mentor_id=mentor1.id,
            project_id=project2.id
        )

        db.session.add_all([vote1, vote2])
        db.session.commit()

    print("✅ Database seeded successfully!")

if __name__ == "__main__":
    seed()
