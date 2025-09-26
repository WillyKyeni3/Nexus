from flask_restful import Resource
from Models import Cohort
from Config import api


class CohortListResource(Resource):
   def get(self):
       cohorts = Cohort.query.all()
       return [
           {"id": c.id, "name": c.name} for c in cohorts
       ]
api.add_resource(CohortListResource, '/cohorts')