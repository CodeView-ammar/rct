from django.db import models
from our_core.models  import CustomModel,CustomModeluseys
from django.utils.translation import gettext_lazy as _
from permission.models import UsersDetiles
from configration.models import Section,Cuntry,Subject,Division,TypeFile
class File(CustomModel):
    section = models.ForeignKey(Section,on_delete=models.CASCADE,null=True,blank=True)
    subject = models.ForeignKey(Subject,on_delete=models.CASCADE)
    type_file = models.ForeignKey(TypeFile,on_delete=models.CASCADE, blank=True, null=True)
    note = models.TextField(_("Note"),max_length=1000,blank=True,null=True)
    approval_file = models.FileField(_("Approval"),upload_to="approval", null=True, blank=True)
    def __str__(self):
        return self.section.name_section+" "+self.subject.name_subject
class Trainer(CustomModel):
    qualification_options=(
        ("d","دكتوراه"),
        ("ms","ماجستير"),
        ("pk","بكالريوس"),
        ("dp","دبلوم"),
    )
    job_options=(
        {"1","مدرب ب"},
        {"2","مدرب أ"},
        {"3","مدرب اول ب"},
        {"4","مدرب اول أ"},
        {"5","كبير المدربين"},
    )
    User=models.ForeignKey(UsersDetiles,on_delete=models.CASCADE,null=True,blank=True)
    fullname= models.CharField(_('full name'), max_length=100,null=True)
    birthday= models.DateField(_('birth date'),null=True,blank=True)
    phone= models.CharField(_('phone'), max_length=10,null=True,blank=True)
    section = models.ForeignKey(Section,on_delete=models.CASCADE,null=True,blank=True)
    qualification= models.CharField(_("qualification"), max_length=100,choices=qualification_options,null=True, blank=True)
    date_qualification= models.DateField(_("date qualification"),null=True, blank=True)
    field_study = models.CharField(_("field study"), max_length=100,null=True, blank=True)
    Cuntry_study = models.ForeignKey(Cuntry,on_delete=models.CASCADE,null=True,blank=True)
    date_start = models.DateField(_("date start"),null=True, blank=True)
    name_job = models.CharField(_("name"),max_length=50,choices=job_options,default="3")
    off_addrs = models.CharField(_("offes address"),max_length=100, blank=True,null=True)
    
    def __str__(self):
        return self.fullname

class Tracking(CustomModeluseys):
    ye={
        ("01",_("First semester")),
        ("02",_("Second semester")),
    }
    
    projram={
        ("morning",_("morning")),
        ("evening",_("evening")),
    }
    trainer = models.ForeignKey(Trainer,on_delete=models.CASCADE)
    semester = models.CharField(_("Semester"),max_length=10,choices=ye,default="01")
    division = models.ForeignKey(Division,on_delete=models.CASCADE)
    projram = models.CharField(_("projram"),max_length=20,choices=projram,default="morning")
    subject = models.ForeignKey(Subject,on_delete=models.CASCADE)
    calculated = models.BooleanField(_("calculated"),default=True)
    status = models.BooleanField(_("status"),default=False)

class DetailsTracking(CustomModel):
    ye={
        ("01",_("First semester")),
        ("02",_("Second semester")),
    }
    tracking = models.ForeignKey(Tracking, on_delete=models.CASCADE,null=True, blank=True)
    count_student = models.IntegerField(_("count student"), default=0)
    max_mark = models.IntegerField(_("max mark"), default=0)
    min_mark = models.IntegerField(_("min mark"), default=0)
    absent = models.IntegerField(_("absent"), default=0)
    less_than = models.IntegerField(_("less than"), default=0)
    mark= models.IntegerField(_("mark"), default=0)
    


class SupervisoryVisits(CustomModeluseys):
    ye={
        ("01",_("First semester")),
        ("02",_("Second semester")),
    }
    evaluation_for= models.CharField(_("evaluation for"),choices={("practical",_("practical")),("theoretical",_("theoretical"))},max_length=100)
    section= models.ForeignKey(Section,on_delete=models.CASCADE)
    trainer = models.ForeignKey(Trainer,on_delete=models.CASCADE)
    Watched = models.BooleanField(_("watched"), default=False)
    Prepared = models.BooleanField(_("prepared"), default=True)
    semester = models.CharField(_("Semester"),max_length=10,choices=ye,default="01")
    date_start = models.DateField(_("date_start"))
    def __str__(self):
        return self.trainer.fullname+" "+self.year

from django.core.validators import MinValueValidator, MaxValueValidator
class InstructorEvaluationManager(models.Manager):
    def create_or_update(self, **kwargs):
        # Implement your custom logic for creating or updating here
        # For example:
        obj, created = self.get_or_create(defaults=kwargs, **kwargs)
        if not created:
            # Update existing object
            for key, value in kwargs.items():
                setattr(obj, key, value)
            obj.save()
        return obj
class InstructorEvaluation(CustomModel):
    supervisoryvisits= models.ForeignKey(SupervisoryVisits,on_delete=models.CASCADE)
    # Planning (15%)
    planning_1 = models.DecimalField(_("There is a written and distributed plan over the weeks of the training semester."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(3.5)],default=3.5)
    planning_2 = models.DecimalField(_("There is a commitment to the timetable of the plan."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(3.5)],default=3.5)

    # Cognitive & Professional Competencies (35%)
    competencies_1 = models.DecimalField(_("Presents the training objectives (cognitive, skill) of the curriculum at the beginning of each training period."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1.5)],default=1.5)
    competencies_2 = models.DecimalField(_("Mastering the training course, its contents, and the related updated scientific facts, knowledge, skills, and basic references."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(2)],default=2)
    competencies_3 = models.DecimalField(_("Presents the information and applies the skills related to the training course in a way that enables the trainee to comprehend and master it."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(2)],default=2)
    competencies_4 = models.DecimalField(_("Contributes to enriching the training course, which positively reflects on the trainees' experiences."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1.5)],default=1.5)
    competencies_5 = models.DecimalField(_("Is familiar with the institution's vision, mission, goals, and policies, and works to achieve them."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    competencies_6 = models.DecimalField(_("Ability to manage trainees within the training place."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    competencies_7 = models.DecimalField(_("Distributing the training period time appropriately over the stages of the training material."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1.5)],default=1.5)
    competencies_8 = models.DecimalField(_("Uses various and modern training methods."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1.5)],default=1.5)
    competencies_9 = models.DecimalField(_("Moves appropriately within the training place."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    competencies_10 = models.DecimalField(_("Uses training resources efficiently and effectively."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    competencies_11 = models.DecimalField(_("Uses e-learning techniques and appropriate training presentation tools."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(2)],default=2)
    competencies_12 = models.DecimalField(_("Ensures the optimal use of training tools and e-learning systems."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1.5)],default=1.5)
    competencies_13 = models.DecimalField(_("Strives to develop his/her skills in using appropriate tools and modern technologies."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1.5)],default=1.5)
    competencies_14 = models.DecimalField(_("Innovating modern training methods for presenting the training course."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(2)],default=2)
    competencies_15 = models.DecimalField(_("Follows the rules and procedures of occupational health and safety."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(0)],default=0)
    competencies_16 = models.DecimalField(_("Ensures the cleanliness of the classroom or laboratory."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(0)],default=0)
    competencies_17 = models.DecimalField(_("Provides suggestions and solutions for safety problems."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(0)],default=0)
    competencies_18 = models.DecimalField(_("Operates and deals with equipment and machinery in a safe manner."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(0)],default=0)
    competencies_19 = models.DecimalField(_("Reports hazards and corrects dangerous practices and conditions."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(0)],default=0)
    competencies_20 = models.DecimalField(_("Identifies the trainees' levels at the beginning of the training semester."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1.5)],default=1.5)
    competencies_21 = models.DecimalField(_("Follows up on the trainees' performance through records."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1.5)],default=1.5)
    competencies_22 = models.DecimalField(_("Considers individual differences between trainees when conducting the evaluation."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1.5)],default=1.5)
    competencies_23 = models.DecimalField(_("Strives to develop trainees through continuous follow-up during the training semester and addressing deficiencies."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(2)],default=2)
    competencies_24 = models.DecimalField(_("Follows multiple strategies in presenting the course to cover the cognitive levels of the trainees."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1.5)],default=1.5)
    competencies_25 = models.DecimalField(_("Ensures the maintenance of devices and equipment in the workshop/laboratories."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(0)],default=0)
    competencies_26 = models.DecimalField(_("Observes the special instructions for maintaining devices and their operation."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(0)],default=0)
    competencies_27 = models.DecimalField(_("Develops methods of caring for the maintenance of equipment and training devices."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(0)],default=0)

    # Professional Development (15%)
    development_1 = models.DecimalField(_("Strives to increase his/her knowledge and experience in his/her specialty field according to the available resources."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1.5)],default=1.5)
    development_2 = models.DecimalField(_("Participates in courses, workshops, lectures, and seminars in the field of specialization."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(2)],default=2)
    development_3 = models.DecimalField(_("Contributes to transferring his/her experiences and what he/she has learned to his/her colleagues."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1.5)],default=1.5)
    development_4 = models.DecimalField(_("Is familiar with the concept and importance of the course file and its benefits."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    development_5 = models.DecimalField(_("Fills out the approved forms related to the course file."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(2)],default=2)
    development_6 = models.DecimalField(_("Organizes the course file in an appropriate manner."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(2)],default=2)

    # Productivity (30%)
    productivity_1  = models.DecimalField(_("Follows up on the trainees' work (assignments, exercises) and records the grades."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    productivity_2  = models.DecimalField(_("Conducts short exams on the course contents."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    productivity_3  = models.DecimalField(_("Analyzes the test results to address the deficiencies."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    productivity_4  = models.DecimalField(_("Diversifies the evaluation methods (oral, written, practical) in accordance with the nature of the training material, the trainees' abilities, and the available resources."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    productivity_5  = models.DecimalField(_("Prepares comprehensive exams for the training curriculum according to scientific foundations."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    productivity_6  = models.DecimalField(_("Utilizes pre-assessment, formative, and summative evaluation methods to measure the achievement of objectives."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    productivity_7  = models.DecimalField(_("Is familiar with the concept of vocational guidance and training counseling."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(0.5)],default=0.5)
    productivity_8  = models.DecimalField(_("Is present in his/her office to guide the trainees."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    productivity_9  = models.DecimalField(_("Carries out the assigned tasks of training guidance and counseling for trainees in the department."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    productivity_10 = models.DecimalField(_("Has the initiative to know the abilities, tendencies, and circumstances of the trainees he/she supervises."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    productivity_11 = models.DecimalField(_("Coordinates with the direct supervisor and the mentor to address the trainees' problems."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1.5)],default=1.5)
    productivity_12 = models.DecimalField(_("Closely and accurately follows up on his/her trainees during the training semester and always seeks to provide them with advice and guidance."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    productivity_13 = models.DecimalField(_("Uses the trainee's performance follow-up record correctly."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1.5)],default=1.5)
    productivity_14 = models.DecimalField(_("Provides effective assistance to each trainee to improve his/her training level."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    productivity_15 = models.DecimalField(_("Identifies the reasons for the trainees' academic failure."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    productivity_16 = models.DecimalField(_("Strives to ensure that trainees have the ability to apply."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    productivity_17 = models.DecimalField(_("Analyzes the results of applications, tests, and observations using appropriate statistical methods."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1.5)],default=1.5)
    productivity_18 = models.DecimalField(_("Prepares a special file for his/her professional achievement according to the designated standards."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(2)],default=2)
    productivity_19 = models.DecimalField(_("Fills out the approved forms related to the course file."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(2)],default=2)
    productivity_20 = models.DecimalField(_("Organizes the course file in an appropriate manner."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(2)],default=2)

    # Activities & Projects (10%)
    activities_1 = models.DecimalField(_("Contributes to the activities related to the trainees."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1.5)],default=1.5)
    activities_2 = models.DecimalField(_("Contributes to the activities related to the training environment."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1.5)],default=1.5)
    activities_3 = models.DecimalField(_("Contributes to the activities related to the training course."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)

    # Personal Competencies (20%)
    personal_1 = models.DecimalField(_("Accepts guidance and discusses it if it is not well understood."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    personal_2 = models.DecimalField(_("Builds good relationships with superiors to improve and develop work."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    personal_3 = models.DecimalField(_("Can express himself/herself and explain his/her idea well."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    personal_4 = models.DecimalField(_("Can be relied upon to perform other tasks."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    personal_5 = models.DecimalField(_("Seeks to establish a good relationship with everyone."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    personal_6 = models.DecimalField(_("Exchanges educational experiences with colleagues in a way that serves the training interest."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    personal_7 = models.DecimalField(_("Takes the initiative to bring closer and strengthen positive relationships with colleagues."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    personal_8 = models.DecimalField(_("Participates with his/her colleagues in carrying out joint work or activities."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    personal_9 = models.DecimalField(_("Sets a good example for the trainees."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    personal_10 = models.DecimalField(_("Balances between trainees."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    personal_11 = models.DecimalField(_("Preserves the dignity of the trainees and is aware of their rights."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(0.5)],default=0.5)
    personal_12 = models.DecimalField(_("Utilizes the trainees' time in a useful manner."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    personal_13 = models.DecimalField(_("Accepts the trainees' observations."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(0.5)],default=0.5)
    personal_14 = models.DecimalField(_("Adheres to the work uniform."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(2)],default=2)
    personal_15 = models.DecimalField(_("Ensures a neat and clean appearance."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(2)],default=2)
    personal_16 = models.DecimalField(_("Adheres to official working hours (attendance, departure)."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1.5)],default=1.5)
    personal_17 = models.DecimalField(_("Is present in his/her office according to the office hours schedule in the department."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    personal_18 = models.DecimalField(_("Attends and participates in department meetings."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    personal_19 = models.DecimalField(_("Adheres to the time allocated for the training periods (start, end)."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1.5)],default=1.5)
    personal_20 = models.DecimalField(_("Follows the administrative procedures in case of absence or leaving the workplace before the end of the work shift."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    personal_21 = models.DecimalField(_("Strives to complete the assigned tasks on time."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1.5)],default=1.5)
    personal_22 = models.DecimalField(_("Observes the rules and regulations in carrying out his/her work."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1)],default=1)
    personal_23 = models.DecimalField(_("Develops methods of completing the assigned tasks according to quality standards."),max_digits=3, decimal_places=2,validators=[MinValueValidator(0.0),MaxValueValidator(1.5)],default=1.5)
    objects = InstructorEvaluationManager()
    




