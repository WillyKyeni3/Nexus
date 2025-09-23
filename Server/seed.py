from App import app, db
from Models import User, Project, Vote
from datetime import datetime

def seed_database():
    with app.app_context():
        print("🗑️ Clearing database...")
        db.drop_all()
        db.create_all()

        print("🌱 Seeding users...")
        # Create test users (both mentors and students)
        mentor1 = User(
            username="mentor_amy",
            email="amy@example.com",
            _password_hash="test_hash",
            role="mentor"
        )
        mentor2 = User(
            username="mentor_bob",
            email="bob@example.com",
            _password_hash="test_hash",
            role="mentor"
        )
        student1 = User(
            username="student_charlie",
            email="charlie@example.com",
            _password_hash="test_hash",
            role="student"
        )
        
        db.session.add_all([mentor1, mentor2, student1])
        db.session.commit()

        print("🌱 Seeding projects...")
        # Create test projects
        project1 = Project(
            title="Cool React App",
            description="A React application for managing tasks",
            owner_id=student1.id
        )
        project2 = Project(
            title="Python CLI Tool",
            description="A command-line interface tool built with Python",
            owner_id=student1.id
        )
        
        db.session.add_all([project1, project2])
        db.session.commit()

        print("🌱 Seeding votes...")
        # Create test votes
        vote1 = Vote(
            status="approved",
            mentor_id=mentor1.id,
            project_id=project1.id
        )
        vote2 = Vote(
            status="declined",
            mentor_id=mentor2.id,
            project_id=project1.id
        )
        
        db.session.add_all([vote1, vote2])
        db.session.commit()

        print("✅ Database seeded!")

        # Test queries
        print("\n🔍 Testing queries...")
        
        # Test Vote model
        print("\nVotes for project 'Cool React App':")
        project_votes = Vote.query.filter_by(project_id=project1.id).all()
        for vote in project_votes:
            print(f"- {vote.mentor.username}: {vote.status}")

        # Test relationships
        print("\nProjects by student_charlie:")
        student_projects = Project.query.filter_by(owner_id=student1.id).all()
        for project in student_projects:
            print(f"- {project.title}")
            print(f"  Votes: {len(project.votes)} votes")

if __name__ == "__main__":
    seed_database()
