class SaveDB():
    inst=list()
    _db=list()
    def make_copy(self,db):
        # if not key in self.__class__.inst.keys():
        self.__class__.inst=[self]
        self.__class__._db=[db]

    def check(self,db):
        if db in self.__class__.inst:
            return False
        else:
            return True

        
    def make_as_last(self):
        return str(self.__class__._db[0])
